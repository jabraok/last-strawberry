import Route from '@ember/routing/route';

export default Route.extend({
  setupController(controller) {
    controller.set("companies", this.store.peekAll("company"));
  },

  model(){
    return this.store.query("company",{"filter[is_vendor]":true});
	}
});
