import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';

export default Controller.extend({
  vendors: filterBy("companies", "isVendor", true),

  actions: {
    showVendor(id) {
      this.transitionToRoute("vendors.show", id);
    },

    async createNewVendor(name) {
      const vendor = this.store.createRecord("company", {name, isVendor:true, isCustomer:false});
      await vendor.save();

      this.transitionToRoute("vendors.show", vendor);
    }
  }
});
