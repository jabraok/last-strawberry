import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
		locationSelected(id) {
			this.transitionToRoute('standing-orders.location', id);
		}
	}
});
