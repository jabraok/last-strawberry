import { all } from 'rsvp';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { run } from '@ember/runloop';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const COMPANY_INCLUDES = [
  "items",
  "items.company",
  "locations",
  "locations.company"
];

const ORDER_INCLUDES = [
	"order-items",
	"order-items.item",
  "location",
  "location.company"
];

export default Route.extend(AuthenticatedRouteMixin, {
  session: service(),

  queryParams: {
    deliveryDate: {
      refreshModel: true
    },
    includePublished: {
      refreshModel: false
    },
    includeUnpublished: {
      refreshModel: false
    },
    companyQuery: {
      refreshModel: false
    },
    includedItems: {
      refreshModel: false
    }
  },

	setupController(controller, model) {
		controller.set("orders", this.store.peekAll("order"));
		controller.set("companies", this.store.peekAll("company"));
    controller.set("locations", this.store.peekAll("location"));
    controller.set("items", this.store.peekAll("item"));

    this._super(controller, model);
	},

	model(params){
    this.params = params;

    return all([
      this.store.query("item", {"filter[is_purchased]":true}),
      this.store.query("company", {"filter[is_vendor]":true, include:COMPANY_INCLUDES.join(",")}),
      this.store.query("order", {
        "filter[order_type]":"purchase-order",
        "filter[delivery_date]":params.deliveryDate,
        include:ORDER_INCLUDES.join(",")
      })
    ]);
	},

  showOrder(order) {
    this.transitionTo("purchase-orders.show", order.get("id"));
  },

  actions: {
    onOrderSelected(order) {
      this.showOrder(order);
    },

    async createOrder(location) {
      const that = this;
      return run(async function() {
        const deliveryDate = that.paramsFor("purchase-orders").deliveryDate;
        const order = await that.store
          .createRecord("order", {location, deliveryDate, orderType:"purchase-order"})
          .save();

        await that.showOrder(order);
      });
    },

    onDateSelected(date) {
      const deliveryDate = this.paramsFor("purchase-orders").deliveryDate;

      if(deliveryDate !== moment(date).format("YYYY-MM-DD")) {
        this.controllerFor("purchase-orders").set("deliveryDate", moment(date).format("YYYY-MM-DD"));
        this.transitionTo("purchase-orders");
      }
    }
  }
});
