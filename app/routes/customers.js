import { all } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

import activeState from "last-strawberry/constants/active-states";

export default Route.extend(AuthenticatedRouteMixin, {
  setupController(controller) {
    controller.set("companies", this.store.peekAll("company"));
    controller.set("priceTiers", this.store.peekAll("price-tier"));
  },

	model(){
    return all([
      this.store.findAll("item"),
      this.store.findAll("price-tier"),
      this.store.query("company", {"filter[active_state]":activeState.ACTIVE})
    ]);
	}
});
