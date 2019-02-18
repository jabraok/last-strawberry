import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const ORDER_INCLUDES = [
	"order-items",
	"order-items.item",
  "location",
  "location.company",
  "location.item-desires",
  "location.item-desires.item",
	"location.notification-rules",
	"notifications"
];

export default Route.extend(AuthenticatedRouteMixin, {

	setupController(controller, model) {
    this._super(controller, model);

		const salesOrderController = this.controllerFor("sales-orders");
		salesOrderController.set("currentSelectedOrder", model);

		controller.set("items", this.store.peekAll("item"));
		controller.set("salesOrders", salesOrderController.get("filteredSalesOrders"));
	},

	model(params){
    return this.store.findRecord("order", params.id, { reload:true, include:ORDER_INCLUDES.join(",")});
	},

  deactivate() {
    const salesOrderController = this.controllerFor("sales-orders");
    salesOrderController.set("currentSelectedOrder", undefined);
  }
});
