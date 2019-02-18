import { isNone } from '@ember/utils';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const INCLUDES = [
  "address",
  "address.visit-windows",
  "address.visit-windows.visit-window-days",
  "item-desires",
  "item-desires.item",
  "item-credit-rates",
  "item-credit-rates.item",
  "visit-days",
  "notification-rules"
];

export default Route.extend(AuthenticatedRouteMixin, {
  setupController(controller, model) {
    controller.set("items", this.store.peekAll("item"));
    this._super(controller, model);
  },

  model(params){
    return this.store.findRecord("location", params.location_id, { reload:true, include:INCLUDES.join(",")});
  },

  async afterModel(model) {
    const itemDesires = model.get("itemDesires");
    const itemCreditRates = model.get("itemCreditRates");

    const items = this.store.peekAll("item");

    items
    .filter(i => i.get("isProduct"))
    .forEach(item => {
      const matchingItemDesire = itemDesires.find(itemDesire => itemDesire.get("item.id") === item.get("id"));

      if(!matchingItemDesire) {
        const itemDesire = this.store.createRecord("item-desire", {location:model, item});
        model.get("itemDesires").pushObject(itemDesire);
      }

      const matchingItemCreditRate = itemCreditRates.find(itemCreditRate => itemCreditRate.get("item.id") === item.get("id"));
      if(!matchingItemCreditRate) {
        const itemCreditRate = this.store.createRecord("item-credit-rate", {location:model, item});
        model.get("itemCreditRates").pushObject(itemCreditRate);
      }
    });

    let address = await model.get("address");
    if(isNone(address)) {
      address = this.store.createRecord("address");
    }

    model.set("address", address);

    return model;
  }
});
