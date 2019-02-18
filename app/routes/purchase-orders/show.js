import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const ORDER_INCLUDES = [
	"order-items",
	"order-items.item",
	"location",
	"location.company",
	"location.notification-rules",
	"notifications"
];

export default Route.extend(AuthenticatedRouteMixin, {

	setupController(controller, model) {
    this._super(controller, model);

		const purchaseOrderController = this.controllerFor("purchase-orders");
		purchaseOrderController.set("currentSelectedOrder", model);

		controller.set("items", this.store.peekAll("item"));
	},

	model(params){
    return this.store.findRecord("order", params.id, { reload:true, include:ORDER_INCLUDES.join(",")});
	},

  deactivate() {
    const purchaseOrderController = this.controllerFor("purchase-orders");
    purchaseOrderController.set("currentSelectedOrder", undefined);
  }
});
