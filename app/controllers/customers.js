import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';

export default Controller.extend({
  active: filterBy("companies", "isActive", true),
  customers: filterBy("active", "isCustomer", true),

  actions: {
    showCustomer(id) {
      this.transitionToRoute("customers.show", id);
    },

    async createNewCustomer(changeset) {
      const insertedData = {
        name: changeset.get("name"),
        locationCodePrefix: changeset.get("locationCodePrefix"),
        terms: changeset.get("terms"),
        priceTier: changeset.get("priceTier")
      };

      const company = this.store.createRecord("company", insertedData);
      await company.save();

      this.transitionToRoute("customers.show", company);
    }
  }
});
