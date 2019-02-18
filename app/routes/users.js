import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

export default Route.extend(AuthenticatedRouteMixin, {
  setupController(controller, model) {
    this._super(controller, model);
		controller.set("users", this.store.peekAll("user"));
	},

	model(){
		return this.store.findAll("user");
	}
});
