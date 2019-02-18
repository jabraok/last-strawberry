import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import downloadFile from "last-strawberry/utils/download-file";
import { run } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import $ from 'jquery';
import { decodePolyline } from "last-strawberry/utils/maps";

export default Controller.extend({
  session: service(),
  pdfGenerator:   service(),

  queryParams:    ["date"],
  date:           moment().add(1, "days").format("YYYY-MM-DD"),

  activeRoutePlans: computed("routePlans.@each.{date,isDeleted}", "date", function() {
    const routePlans = this.get("routePlans");
    const date = this.get("date");
    return routePlans
      .filter(rp => rp.get("date") === date)
      .filter(rp => !rp.get("isDeleted"));
  }),

  activeRouteVisits: computed("routeVisits.@each.{date}", "date", function() {
    const routeVisits = this.get("routeVisits");
    const date = this.get("date");
    return routeVisits
      .filter(rv => rv.get("date") === date)
      .filter(rv => rv.get("isValid"))
  }),

  openRouteVisits: filterBy("activeRouteVisits", "isOpen", true),

  drivers: filterBy("users", "isDriver", true),

  async setPolyline(routePlan){
    if(isEmpty(routePlan.get("routeVisits"))) {
      run(() => routePlan.set("polyline", ""));
    } else {
      const hq = "-118.317191,34.1693137";
      const routeVisits = await routePlan.get("routeVisits");
      const coordinates = routeVisits
        .map(rv => [rv.get("lng"), rv.get("lat")])
        .map(coords => coords.join(","));
      const query = R.flatten([hq, coordinates, hq]).join(";");

      const apiToken = this.get("session.data.authenticated.mapbox_api_token");
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${query}?geometries=polyline&access_token=${apiToken}`;
      const result = await $.ajax({ url, type:"GET" });

      if(isPresent(result.routes)){
        run(() => routePlan.set("polyline", decodePolyline(result.routes[0].geometry)));
      } else {
        run(() => routePlan.set("polyline", ""));
      }
    }
  },

  actions: {
    async printFulfillmentDocuments() {
      const { url, key } = await this.get("pdfGenerator")
        .printFulfillmentDocuments(this.get("activeRoutePlans"));
      return downloadFile(url, key);
    },

    generateRoutePlanCSV() {
      const headers = ["", "Position", "Store Code", "Store Name", "Address", "City", "State", "Zip", "Lat", "Lon", "In Time (mins)", "Out Time (mins)", "In Time", "Out Time", "Service Time"];
      const emptyArr = Array(headers.length).fill('');

      const data =
        this.get("activeRoutePlans")
          .toArray()
          .reduce((acc, cur) => {
            const routeData = Array(headers.length).fill('');
            routeData[0] = cur.get('user.name');

            const visitData = cur.get('sortedActiveRouteVisits')
              .map((rv, i)=> {
                const code = rv.get('location.code'),
                      name = rv.get('company.name'),
                      street = rv.get('address.street'),
                      city = rv.get('address.city'),
                      state = rv.get('address.state'),
                      zip = rv.get('address.zip'),
                      lat = rv.get('lat'),
                      lng = rv.get('lng'),
                      min = rv.get('visitWindow.min'),
                      max = rv.get('visitWindow.max'),
                      minFormatted = rv.get('visitWindow.minFormatted'),
                      maxFormatted = rv.get('visitWindow.maxFormatted'),
                      service = rv.get('visitWindow.service');

                return ["", i + 1, code, name, street, city, state, zip, lat, lng, min, max, minFormatted, maxFormatted, service]
              });

            return R.concat(
              R.concat(acc,
                R.concat(R.concat([routeData], [headers]), [emptyArr])), R.concat(visitData, [emptyArr]));
          }, []);

      this.get('excel').export(data, {sheetName: 'MLVK - Sorted Visits', fileName: `${this.get('date')}.xlsx`});
    },

    onDateSelected(date) {
      this.set("date", moment(date).format("YYYY-MM-DD"));
    },

    selectRouteVisit(routeVisit) {
      if(this.get("selectedRouteVisit") !== routeVisit && routeVisit != null) {
        this.set("selectedRouteVisit", routeVisit);
      }
    },

    deSelectRouteVisit() {
      this.set("selectedRouteVisit", undefined);
    },

    async saveRoutePlanBlueprint(changeset) {
      const routePlanBlueprint = await this.store
        .createRecord("route-plan-blueprint", {name: changeset.get("name"), user: changeset.get("user")})
        .save();

      const routePlan = changeset.get("routePlan");
      const routeVisits = await routePlan.get("sortedRouteVisits");

      routeVisits.forEach((rv, i) => {
        const address = rv.get("address");
        this.store
          .createRecord("route-plan-blueprint-slot", {routePlanBlueprint, position:i, address})
          .save();
      });
    },

    destroyRoutePlan(routePlan) {
      routePlan.destroyRecord();
    },

    async onRouteVisitUpdate(ot) {
      const { routeVisit, fromRoutePlan, toRoutePlan, position } = ot;

      routeVisit.setProperties({routePlan: toRoutePlan, position});
      await routeVisit.save();

      if(isPresent(fromRoutePlan)) {
        this.setPolyline(fromRoutePlan);
      }

      if(isPresent(toRoutePlan)) {
        this.setPolyline(toRoutePlan);
      }
    },

    removeRouteVisit(routeVisit, routePlanPromise) {
      routeVisit.set("routePlan", undefined);
      routeVisit.save();

      run(() => routePlanPromise.then(rp => this.setPolyline(rp)));
    },

    async applyTemplate(routePlanBlueprint) {
      const routePlan = await this.store
        .createRecord("route-plan", {date: this.get("date"), user: routePlanBlueprint.get("user")})
        .save();

      const orphanedRouteVisits = this.store.peekAll("route-visit")
        .filter(rv => rv.get("isOpen"));

      routePlanBlueprint.get("routePlanBlueprintSlots")
        .forEach(slot => {
          const match = orphanedRouteVisits.find(rv => rv.get("address.id") === slot.get("address.id"));
          if(match) {
            match.setProperties({position:10+slot.get("position"), routePlan});
            match.save();
          }
        });

      this.setPolyline(routePlan);
    },

    updateRoutePlan(routePlan, key, val) {
      routePlan.set(key, val);
      routePlan.save();
    },

    createRoutePlan() {
      this.store
        .createRecord("route-plan", {date:this.get("date")})
        .save();
    }
  }
});
