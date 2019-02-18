import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import $ from 'jquery';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import config from "last-strawberry/config/environment";

const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

export default Controller.extend({
  session: service(),

  queryParams: ["deliveryDate", "includePublished", "includeUnpublished", "companyQuery", "includedItems"],

  deliveryDate: tomorrow,
  includePublished: true,
  includeUnpublished: true,
  companyQuery: "",
  includedItems: "",

  filteredSalesOrders: computed("salesOrders.@each.{deliveryDate,isSalesOrder}", "deliveryDate", function() {
    const salesOrders = this.get("salesOrders");
    const deliveryDate = this.get("deliveryDate");
    return salesOrders.filter(order => {
      const matchesDate = order.get("deliveryDate") === deliveryDate;
      return matchesDate && order.get("isSalesOrder");
    });
  }),

  unfulfilledLocations: computed("locations.@each.{active,isCustomer}", "filteredSalesOrders.[]", function() {
    const locations = this.get("locations");
    const salesOrders = this.get("filteredSalesOrders");
    const fulfilledLocations = salesOrders.map(o => o.get("location").content);
    const allLocations = locations
      .filter(l => l.get("active") && l.get("isCustomer"))
      .toArray();

    return _.difference(allLocations, fulfilledLocations);
  }),

  isOldDate: computed("deliveryDate", function() {
    const deliveryDate = this.get("deliveryDate");
    return moment(deliveryDate).isBefore(tomorrow);
  }),

  filteredItems: filterBy("items", "isSold", true),

  allItems: computed("items.@each.{isSold,active}", function() {
    const items = this.get("items");
    return items
            .filter(item => item.get("isSold") && item.get("active"))
            .sortBy("name");
  }),

  showSalesOrder(order) {
    this.transitionToRoute("sales-orders.show", order.get("id"));
  },

  transitionToDate(toDate) {
    const currentDate = this.get("deliveryDate");
    const newDate = moment(toDate).format("YYYY-MM-DD");

    if(newDate !== currentDate) {
      this.set("deliveryDate", newDate);
      this.transitionToRoute("sales-orders");
    }
  },

  actions: {
    onRequestNewOrder() {
      this.set("showCreateSalesOrderModal", true);
    },

    onRequestDuplicateOrders() {
      this.set("showDuplicateOrdersModal", true);
    },

    closeCreateSalesOrder() {
      this.set("showCreateSalesOrderModal", false);
    },

    closeDuplicateOrders() {
      this.set("showDuplicateOrdersModal", false);
    },

    updateIncludedItems(items) {
      const selected = items.map((item) => item.id).join(",");
      this.set("includedItems", selected);
    },

    onOrderSelected(order) {
      this.showSalesOrder(order);
    },

    async createSalesOrder(location) {
      const that = this;
      return run(async function() {
        const deliveryDate = that.get("deliveryDate");
        const order = await that.store
          .createRecord("order", {location, deliveryDate})
          .save();

        await that.showSalesOrder(order);
      });
    },

    stubOrders () {
      const deliveryDate = this.get("deliveryDate");

      this.set("isStubbing", true);

      this.get("session").authorize("authorizer:devise", async (headerName, headerValue) => {

        const headers = {};
        headers[headerName] = headerValue;
        const payload = {
          url:`${config.apiHost}/orders/stub_orders`,
          data:{deliveryDate},
          headers,
          type:"POST"
        };

        const newOrders = await $.ajax(payload);
        this.store.pushPayload(newOrders);

        this.set("isStubbing", false);

      });
    },

    duplicateOrders(fromDate, toDate) {
      return new Promise((res, rej) => {
        this.get("session").authorize("authorizer:devise", (headerName, headerValue) => {

          const headers = {};
          headers[headerName] = headerValue;
          const payload = {
            url:`${config.apiHost}/orders/duplicate_sales_orders`,
            data:{fromDate, toDate},
            headers,
            type:"POST"
          };

          $.ajax(payload)
            .always(response => {
              if(response.status) {
                res();
                this.transitionToDate(toDate);
              } else {
                rej(response.message);
              }
            });
        });
      });
    },

    onDateSelected(date) {
      this.transitionToDate(date);
    }
  }
});
