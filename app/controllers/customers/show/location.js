import Controller from '@ember/controller';
import { computed } from '@ember/object';
import AddressValidations from "last-strawberry/validators/address";

export default Controller.extend({
  AddressValidations,

  itemSettings: computed("items.@each.{isProduct,active}", "model.{itemDesires.[],itemCreditRates.[]}", function() {
    const items = this.get('items');
    const itemDesires = this.get('model.itemDesires');
    const itemCreditRates = this.get('model.itemCreditRates');
    return items
      .filter(i => i.get("isProduct") && i.get("active"))
      .map(item => {
        const itemDesire = itemDesires.find(itemDesire => itemDesire.get("item.id") === item.get("id"));
        const itemCreditRate = itemCreditRates.find(itemCreditRate => itemCreditRate.get("item.id") === item.get("id"));

        return {
          item,
          itemDesire,
          itemCreditRate
        };
      });
  }),

  addresses: computed("model.company.activeLocations.@each.{locationHash}", function() {
    const locations = this.get("model.company.activeLocations");
    return locations.map(location => location.get("address"));
  }),

  actions: {
    updateItemDesire(itemDesire, enabled) {
      itemDesire.set("enabled", enabled);
      itemDesire.save();
    },

    updateItemCreditRate(itemCreditRate, rate) {
      itemCreditRate.set("rate", rate);
      itemCreditRate.save();
    },

    onVisitDayChange(day, enabled) {
      const location = this.get('model');
      const visitDays = location.get("visitDays");

      const visitDay = visitDays.find(visitDay => visitDay.get("day") === day) || this.store.createRecord("visit-day", {location, day});

      visitDay.set("enabled", enabled);
      visitDay.save();
    },

    async onVisitWindowDayChange(visitWindow, day, enabled) {
      if(visitWindow.get("hasDirtyAttributes")) {
        await visitWindow.save();
      }

      const visitWindowDay = visitWindow.get("visitWindowDays").find(vwd => vwd.get("day") === day) || this.store.createRecord("visit-window-day", {visitWindow, day});

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

    archiveLocation(location){
      const company = location.get("company");
      this.transitionToRoute("customers.show", company);

      location.set("active", false);
      location.save();
    },

    async massApplyCreditRate(location, massCreditRate){
      let itemCreditRates = await location.get("itemCreditRates");

      itemCreditRates.forEach(function(item) {
        item.set("rate", massCreditRate);
        item.save();
      });
    },

    async massApplyDesire(location, massDesire){
      let itemDesires = await location.get("itemDesires");

      itemDesires.forEach(function(item) {
        item.set("enabled", massDesire);
        item.save();
      });
    },

    createNotification(location) {
      this.store.createRecord("notification-rule", { location });
    },

    saveNotification(changeset){
      changeset.save();
    },

    deleteNotification(notification){
      notification.destroyRecord();
    },

    deleteVisitWindow(visitWindow){
      visitWindow.destroyRecord();
    }
  }
});
