import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
		async createOrderTemplate() {
			const location = this.get('model');
			const orderTemplate = this.store.createRecord('order-template', {location, startDate:moment().toDate()});
			await orderTemplate.save();

			this.transitionToRoute('standing-orders.location.order-template', orderTemplate.get('id'));
		},

		selectOrderTemplate(id) {
			this.transitionToRoute('standing-orders.location.order-template', id);
		}
	}
});
