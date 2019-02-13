import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

export default Controller.extend({
  queryParams: ["deliveryDate", "includePublished", "includeUnpublished", "companyQuery", "includedItems"],

  deliveryDate: tomorrow,
  includePublished: true,
  includeUnpublished: true,
  companyQuery: "",
  includedItems: "",

  @computed("orders.@each.{deliveryDate,isPurchaseOrder}", "deliveryDate")
  filteredOrders() {
    const orders = this.get("orders");
    const deliveryDate = this.get("deliveryDate");
    return orders.filter(order => {
      const matchesDate = order.get("deliveryDate") === deliveryDate;
      return matchesDate && order.get("isPurchaseOrder");
    });
  },

  @computed("deliveryDate")
  isOldDate() {
    const deliveryDate = this.get("deliveryDate");
    return moment(deliveryDate).isBefore(tomorrow);
  },

  @computed("locations.@each.{active,isVendor}", "filteredOrders.[]")
  unfulfilledLocations() {
    const locations = this.get("locations");
    const purchaseOrders = this.get("filteredOrders");
    const fulfilledLocations = purchaseOrders.map(o => o.get("location").content);
    const allLocations = locations
      .filter(l => l.get("active") && l.get("isVendor"))
      .toArray();

    return _.difference(allLocations, fulfilledLocations);
  },

  @computed("items.@each.{isPurchased,active}")
  allItems() {
    const items = this.get("items");
    return items
            .filter(item => item.get("isPurchased") && item.get("active"))
            .sortBy("name");
  },

  actions: {
    onRequestNewOrder() {
      this.set("showCreateOrderModal", true);
    },

    closeCreateOrder() {
      this.set("showCreateOrderModal", false);
    },

    updateIncludedItems(items) {
      const selected = items.map((item) => item.id).join(",");
      this.set("includedItems", selected);
    }
  }
});
