import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  classNames: ["row"],

  @computed("model.total_sales", "totalSales")
  salesRatio() {
    const local = this.get("model.total_sales");
    const total = this.get("totalSales");
    return Number(local) / total;
  },

  @computed("model.total_spoilage", "totalSpoilage")
  spoilageRatio() {
    const local = this.get("model.total_spoilage");
    const total = this.get("totalSpoilage");
    return Number(local) / total;
  }

});
