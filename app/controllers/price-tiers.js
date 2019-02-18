import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    showPriceTier(id) {
      this.transitionToRoute("price-tiers.show", id);
    },

    async createNewPriceTier(name) {
      const priceTier = this.store.createRecord("price-tier", {name});
      await priceTier.save();

      this.transitionToRoute("price-tiers.show", priceTier.id);
    }
  }
});
