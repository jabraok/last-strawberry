import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';

export default Controller.extend({
  actions: {
    createLineItem(orderTemplate, item) {
      this.store
        .createRecord('order-template-item', {orderTemplate, item})
        .save();
    },

    async onDaysChanged(orderTemplate, day, enabled) {
      const collection = await orderTemplate.get('orderTemplateDays');
      let match = collection.find(item => item.get('day') === day);

      if(isBlank(match)) {
        match = this.store.createRecord('order-template-day', {orderTemplate, day, enabled});
      }

      match.set('enabled', enabled);
      match.save();
    },

		dateSelected(model, date) {
			model.set('startDate', moment(date).format("YYYY-MM-DD"));
			model.save();
		},

    saveModel(model) {
      model.save();
    },

    deleteLineItem(model) {
      model.destroyRecord();
    },

		async deleteOrderTemplate(model) {
			const locationId = await model.get('location.id');
			await model.destroyRecord();
			this.transitionToRoute('standing-orders.location', locationId);
		}
	}
});
