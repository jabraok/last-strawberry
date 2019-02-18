import Route from '@ember/routing/route';

const MODEL_INCLUDES = [
	"company",
  "order-templates",
  "order-templates.order-template-items",
	"order-templates.order-template-items.item",
  "order-templates.order-template-days"
];

export default Route.extend({
	setupController(controller, model) {
		this.controllerFor('standing-orders').set("currentLocation", model);
		this.controllerFor('standing-orders.location').set("currentOrderTemplate", undefined);

		this._super(...arguments);
	},

  model(params) {
    return this.store.findRecord("location", params.location_id, {
      include:MODEL_INCLUDES.join(",")
    });
  }
});
