import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  classNames: ["row"],

  routing: service('-routing'),

  init() {
    this._super(...arguments);

    this.settingMenuItems = [
      {route:"standing-orders", label:"Standing Orders"},
      {route:"reports.customer-financials", label:"Customer Report"},
      {route:"reports.product-financials", label:"Product Report"},
      {route:"products", label:"Products"},
      {route:"items", label:"Ingredients"},
      {route:"customers", label:"Customers"},
      {route:"vendors", label:"Vendors"},
      {route:"price-tiers", label:"Price Tiers", icon:"attach_money"},
      {route:"route-plan-blueprints", label:"Route Blueprints", icon:"list"},
      {route:"users", label:"Users", icon:"supervisor_account"}
    ];

    this.addListener();
  },

  addListener() {
    this.get('routing.router').on('didTransition', this.handleDidTransition.bind(this));
  },

  updateCurrentSelectedPath(route) {
    this.set("nextRoute", route.split(".")[0]);
  },

  handleDidTransition() {
    this.updateCurrentSelectedPath(this.get('routing.currentRouteName'));
  },

  actions: {
    navigateToRoute(route) {
      this.updateCurrentSelectedPath(route);
      this.get("navigateToRoute")(route);
    }
  }
});
