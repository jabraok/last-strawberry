import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

const FinancialRatios = Component.extend({
  classNames: ["col", "stretch"],

  @computed("model.{total_sales_revenue,total_dist_revenue}")
  totalGrossSales() {
    const sales = this.get("model.total_sales_revenue");
    const dist = this.get("model.total_dist_revenue");
    return Number(sales) + Number(dist);
  },

  @computed("totalGrossSales", "model.total_spoilage")
  totalNetSales() {
    const sales = this.get("totalGrossSales");
    const spoilage = this.get("model.total_spoilage");
    return sales - Number(spoilage);
  },

  @computed("totalGrossSales", "model.total_spoilage")
  grossMargin() {
    const totalGrossSales = this.get("totalGrossSales");
    const spoilage = this.get("model.total_spoilage");
    return (1 - Number(spoilage) / totalGrossSales);
  },

  @computed("model.raw_data.[]")
  totalVisits() {
    const rawData = this.get("model.raw_data");
    return _
      .flattenDeep(rawData.map(l => l.raw_data))
      .length;
  },

  @computed("totalSales", "totalGrossSales")
  percOfTotalSales() {
    const total = this.get("totalSales");
    const local = this.get("totalGrossSales");
    return local/total;
  },

  @computed("totalNetSales", "totalVisits")
  aveCostPerVisit() {
    const totalNetSales = this.get("totalNetSales");
    const totalVisits = this.get("totalVisits");
    return totalNetSales/totalVisits;
  }
});

export default FinancialRatios.reopenClass({
  positionalParams: ['model']
});
