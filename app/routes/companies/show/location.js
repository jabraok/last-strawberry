import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
const { run } = Ember;

const INCLUDES = [
  'address',
  'item-desires',
  'item-desires.item',
  'item-credit-rates',
  'item-credit-rates.item',
  'visit-days',
  'visit-windows',
  'visit-windows.visit-window-days'
];

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  setupController(controller, model) {
    this._super(controller, model);

    controller.set('items', this.store.peekAll('item'));
  },

  model(params){
    return this.store.findRecord('location', params.location_id, {include:INCLUDES.join(',')});
  },

  afterModel(model) {
    const itemDesires = model.get('itemDesires');
    const itemCreditRates = model.get('itemCreditRates');

    const items = this.store.peekAll('item');

    items.forEach(item => {
      const matchingItemDesire = itemDesires.find(itemDesire => itemDesire.get('item.id') === item.get('id'));

      if(!matchingItemDesire) {
        const itemDesire = this.store.createRecord('item-desire', {location:model, item});
        model.get('itemDesires').pushObject(itemDesire);
      }

      const matchingItemCreditRate = itemCreditRates.find(itemCreditRate => itemCreditRate.get('item.id') === item.get('id'));
      if(!matchingItemCreditRate) {
        const itemCreditRate = this.store.createRecord('item-credit-rate', {location:model, item});
        model.get('itemCreditRates').pushObject(itemCreditRate);
      }
    });

    return model;
  },

  async _saveAddress() {
    const location = this.modelFor('companies.show.location');
    const address = await location.get('address');

    if(!address.get('isSaving')) {
      await address.save();
      location.save();
    }
  },

  actions: {

    updateItemDesire(itemDesire, enabled) {
      itemDesire.set('enabled', enabled);
      itemDesire.save();
    },

    updateItemCreditRate(itemCreditRate, rate) {
      itemCreditRate.set('rate', rate);
      itemCreditRate.save();
    },

    onVisitDayChange(day, enabled) {
      const location = this.modelFor('companies.show.location');
      const visitDays = location.get('visitDays');

      const visitDay = visitDays.find(visitDay => visitDay.get('day') === day) || this.store.createRecord('visit-day', {location, day});

      visitDay.set('enabled', enabled);
      visitDay.save();
    },

    async onVisitWindowDayChange(visitWindow, day, enabled) {
      if(visitWindow.get('hasDirtyAttributes')) {
        await visitWindow.save();
      }

      const visitWindowDay = visitWindow.get('visitWindowDays').find(vwd => vwd.get('day') === day) || this.store.createRecord('visit-window-day', {visitWindow, day});

      visitWindowDay.set('enabled', enabled);
      visitWindowDay.save();
    },

    onVisitWindowChange(model, attr, val) {
      console.log('onVisitWindowChange');
      model.set(attr, val);
      model.save();
    },

    createVisitWindow() {
      const location = this.modelFor('companies.show.location');
      this.store.createRecord('visit-window', {location});
    },

    fieldChanged(model, key, value) {
      model.set(key, value);
    },

    async saveLocation() {
      const location = this.modelFor('companies.show.location');
      this._saveRecord(location);
    },

    async updateAddress(newAddressData) {
      const location = this.modelFor('companies.show.location');
      let address = await location.get('address');

      if(!address) {
        address = this.store.createRecord('address');
        location.set('address', address);
      }

      address.setProperties(newAddressData);
      this._saveAddress();
    },

    saveAddress() {
      this._saveAddress();
    },

    async deleteLocation() {
      const location = this.modelFor('companies.show.location');
      if(!location.get('isDeleted')) {
        run(() => location.destroyRecord());
      }
    }

  }
});
