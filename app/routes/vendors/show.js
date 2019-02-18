import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const INCLUDES = [
  "locations",
	"locations.address"
];

export default Route.extend(AuthenticatedRouteMixin, {
  model(params){
    return this.store.findRecord("company", params.id, { reload:true, include:INCLUDES.join(",")});
  }
});
