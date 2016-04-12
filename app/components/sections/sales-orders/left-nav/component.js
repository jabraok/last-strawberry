import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  classNames: ['section_sales-order_left-nav', 'row', 'stretch'],

  @computed('salesOrders.[]')
  groupedSalesOrders(salesOrders) {
    return _
      .chain(salesOrders)
      .sortBy(item => item.get('location.company.name'))
      .groupBy(item => item.get('location.company.name'))
      .value();
  }
});