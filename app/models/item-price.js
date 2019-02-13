import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";
import { computed } from 'ember-decorators/object';

export default Model.extend({
  price:      attr("number", {defaultValue: 0}),

  item:       belongsTo("item"),
  priceTier:  belongsTo("price-tier"),

  @computed("isNew", "item.active")
  isPending() {
    const isNew = this.get("isNew");
    const isItemActive = this.get("item.active");
    return isNew && isItemActive;
  },

  @computed("isNew", "item.active")
  isActive() {
    const isNew = this.get("isNew");
    const isItemActive = this.get("item.active");
    return !isNew && isItemActive;
  }
});
