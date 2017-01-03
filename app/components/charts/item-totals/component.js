import Ember from "ember";
import computed from "ember-computed-decorators";

export default Ember.Component.extend({
  classNames: ["col", "card-1"],
  page:"sales_orders",
  isHidden:true,

  async willRender(){
    let isHidden = await localforage.getItem(this.get("LSKey"));
    if(!Ember.isPresent(isHidden)){
      isHidden = true;
    }
      this.set("isHidden", isHidden);
  },

  @computed("page")
  LSKey(page){
    return page + "_item_totals_is_close";
  },

  @computed("orders.@each.{totalQuantity}")
  itemTotals(orders = Ember.A()) {
    return _
      .chain(orders.toArray())
      .map(order => order.get("orderItems").toArray())
      .flatten()
      .groupBy(orderItem => orderItem.get("item.name"))
      .mapValues(orderItems =>
        orderItems.reduce((acc, cur) =>
          ({p:cur.get("item.position"), q:acc["q"] + Number(cur.get("quantity"))}), {p:0, q:0}))

      .map(({p, q}, name) => ({name, quantity:q, position:p}))
      .filter(row => row.quantity > 0)
      .sortBy(["position"])
      .value();
  },

  @computed("orders.@each.{totalQuantity}")
  totalUnits(orders = Ember.A()) {
    return orders.reduce((acc, cur) => acc + cur.get("totalQuantity"), 0);
  },

  actions: {
    toggleOpenClose(){
      this.set("isHidden", !this.get("isHidden"));
      localforage.setItem(this.get("LSKey"), this.get("isHidden"));
    }
  }
});
