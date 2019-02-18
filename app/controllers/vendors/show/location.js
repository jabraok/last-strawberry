import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AddressValidations from "last-strawberry/validators/address";

export default Controller.extend({
  AddressValidations,

  addresses: computed("model.company.activeLocations.@each.{locationHash}", function() {
    const locations = this.get("model.company.activeLocations");
    return locations.map(location => location.get("address"));
  }),

  actions: {
    saveLocation(changeset) {
      changeset.save();
    },

    switchAddress(location, address) {
      location.set("address", address);
      location.save();
    },

    async saveAddress(location, changeset) {
      await changeset.save();
      location.save();
    },

    onVisitDayChange(day, enabled) {
      const location = this.get('model');
      const visitDays = location.get("visitDays");

      const visitDay = visitDays
                        .find(visitDay => visitDay.get("day") === day) ||
                            this.store.createRecord("visit-day", {location, day});

      visitDay.set("enabled", enabled);
      visitDay.save();
    },

    async onVisitWindowDayChange(visitWindow, day, enabled) {
      if(visitWindow.get("hasDirtyAttributes")) {
        await visitWindow.save();
      }

      const visitWindowDay = visitWindow
                              .get("visitWindowDays")
                              .find(vwd => vwd.get("day") === day) ||
                                this.store.createRecord("visit-window-day", {visitWindow, day});

      visitWindowDay.set("enabled", enabled);
      visitWindowDay.save();
    },

    onVisitWindowChange(model, attr, val) {
      model.set(attr, val);
      model.save();
    },

    createVisitWindow() {
      const location = this.get('model');
      const address = location.get("address");
      this.store.createRecord("visit-window", {address});
    },

    createNotification(location) {
      this.store.createRecord("notification-rule", { location, wantsCredit:false });
    },

    saveNotification(changeset){
      changeset.save();
    },

    deleteNotification(notification){
      notification.destroyRecord();
    },

    archiveLocation(location){
      const company = location.get("company");
      this.transitionToRoute("vendors.show", company);

      location.set("active", false);
      location.save();
    },

    deleteVisitWindow(visitWindow){
      visitWindow.destroyRecord();
    }
  }
});
