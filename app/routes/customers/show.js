import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const INCLUDES = [
  "locations",
	"locations.address"
];

export default Route.extend(AuthenticatedRouteMixin, {

  setupController(controller, model) {
    controller.set("priceTiers", this.store.peekAll("price-tier"));
    this._super(controller, model);
  },

  model(params){
    return this.store.findRecord("company", params.company_id, { reload:true, include:INCLUDES.join(",")});
  }
});
