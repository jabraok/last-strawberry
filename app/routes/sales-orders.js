import { all } from 'rsvp';
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from "ember-simple-auth/mixins/authenticated-route-mixin";

const COMPANY_INCLUDES = [
  "locations",
  "locations.company",
  "price-tier",
  "price-tier.item-prices",
  "price-tier.item-prices.item"
];

const ORDER_INCLUDES = [
	"order-items",
	"order-items.item",
  "location",
  "location.company"
];

export default Route.extend(AuthenticatedRouteMixin, {
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
		controller.set("salesOrders", this.store.peekAll("order"));
		controller.set("companies", this.store.peekAll("company"));
    controller.set("locations", this.store.peekAll("location"));
    controller.set("items", this.store.peekAll("item"));

    this._super(controller, model);
	},

	model(params){
    return all([
      this.store.query("item", {"filter[is_sold]":true}),
      this.store.query("company", {include:COMPANY_INCLUDES.join(",")}),
      this.store.query("order", {
        "filter[order_type]":"sales-order",
        "filter[delivery_date]":params.deliveryDate,
        include:ORDER_INCLUDES.join(",")
      })
    ]);
	}
});
