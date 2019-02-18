import { isNone } from '@ember/utils';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const INCLUDES = [
  "address",
  "address.visit-windows",
  "address.visit-windows.visit-window-days",
  "visit-days",
  "notification-rules"
];

export default Route.extend(AuthenticatedRouteMixin, {
  model(params){
    return this.store.findRecord("location", params.location_id, { reload:true, include:INCLUDES.join(",")});
  },

  async afterModel(model) {
    let address = await model.get("address");
    if(isNone(address)) {
      address = this.store.createRecord("address");
    }
    model.set("address", address);

    return model;
  }
});
