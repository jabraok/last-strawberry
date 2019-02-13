import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

const CompaniesFinancials = Component.extend({
  classNames: ["row", "stretch", "card-1", "companies-financials"],

  @computed("model")
  totalVisits() {
    const rawData = this.get("model");
    return _
      .flattenDeep(rawData
        .map(c => c.raw_data
          .map(l => l.raw_data)))
      .length;
  },

  @computed("model")
  totalSales() {
    const rawData = this.get("model");
    return rawData
      .reduce((acc, cur) => {
        return acc + Number(cur.total_sales_revenue);
      }, 0);
  },

  @computed("model")
  totalDist() {
    const rawData = this.get("model");
    return rawData
      .reduce((acc, cur) => {
        return acc + Number(cur.total_dist_revenue);
      }, 0);
  },

  @computed("model")
  totalSpoilage() {
    const rawData = this.get("model");
    return rawData
      .reduce((acc, cur) => {
        return acc + Number(cur.total_spoilage);
      }, 0);
  },

  @computed("totalSales", "totalDist", "totalSpoilage", "totalVisits")
  aveSalePerVisit() {
    const totalSales = this.get("totalSales");
    const totalDist = this.get("totalDist");
    const totalSpoilage = this.get("totalSpoilage");
    const totalVisits = this.get("totalVisits");
    return ((totalSales + totalDist) - totalSpoilage) / totalVisits;
  },

  @computed("totalSales", "totalSpoilage")
  spoilageSalesRatio() {
    const totalSales = this.get("totalSales");
    const totalSpoilage = this.get("totalSpoilage");
    return totalSpoilage / totalSales;
  }
});

export default CompaniesFinancials.reopenClass({
  positionalParams: ['model']
});
