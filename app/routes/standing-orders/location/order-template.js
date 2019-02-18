import Route from '@ember/routing/route';

const MODEL_INCLUDES = [
	"order-template-items",
  "order-template-items.item",
  "order-template-days",
  "location",
  "location.company"
];

export default Route.extend({
  setupController(controller, model) {
    controller.set("items", this.store.peekAll("item"));

		this.controllerFor('standing-orders.location').set("currentOrderTemplate", model);

    this._super(...arguments);
  },

  model(params) {
    return this.store.findRecord("order-template", params.order_template_id, {
      include:MODEL_INCLUDES.join(",")
    });
  }
});
