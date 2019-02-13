import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

const CompaniesFinancials = Component.extend({
  classNames: ["row", "stretch", "card-1", "product-financials"],

  @computed("model.@each.{total_sales}")
  totalSales() {
    const model = this.get("model");
    return model
      .reduce((acc, cur) => {
        return acc + Number(cur.total_sales);
      }, 0);
  },

  @computed("model.@each.{total_spoilage}")
  totalSpoilage() {
    const model = this.get("model");
    return model
      .reduce((acc, cur) => {
        return acc + Number(cur.total_spoilage);
      }, 0);
  }
});

export default CompaniesFinancials.reopenClass({
  positionalParams: ['model']
});
