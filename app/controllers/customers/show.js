import Controller from '@ember/controller';
import activeState from "last-strawberry/constants/active-states";

export default Controller.extend({
  actions: {
    archiveCompany(model) {
      model.set("activeState", activeState.ARCHIVED)
      model.save();

      this.transitionToRoute("customers");
    },

    updatePriceTier(priceTier) {
      const company = this.get('model');

      company.set("priceTier", priceTier);
      company.save();
    },

    showLocation(id) {
      this.transitionToRoute("customers.show.location", id);
    },

    saveCompany(changeset) {
      changeset.save();
    },

    async createNewLocation() {
      const company = this.get('model');

      const location = this.store.createRecord("location", {company, name});
      await location.save();

      this.transitionToRoute("customers.show.location", location);
    }
  }
});
