import LocationHashable from "last-strawberry/mixins/location-hashable";
import { computed } from '@ember/object';
import Model from "ember-data/model";
import attr from "ember-data/attr";
import { hasMany } from "ember-data/relationships";

export default Model.extend(LocationHashable, {
  street:       attr("string"),
  city:         attr("string"),
  state:        attr("string"),
  zip:          attr("string"),
  lat:          attr("number"),
  lng:          attr("number"),

  locations:    hasMany("location"),
  visitWindows: hasMany("visit-window"),
  routeVisits:  hasMany("route-visit"),

  full: computed("street", "city", "state", "zip", function() {
    const street = this.get("street");
    const city = this.get("city");
    const state = this.get("state");
    const zip = this.get("zip");
    let full = street? `${street}`: "";
    full = city? `${full}, ${city}`: full;
    full = state? `${full}, ${state}`: full;
    full = zip? `${full} ${zip}`: full;

    return full;
  }),

  visitWindowForDate(date) {
    return this.get("visitWindows").find(vw => vw.validForDate(date));
  }
});
