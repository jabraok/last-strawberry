import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveCompany(changeset){
      changeset.save();
    },

    showLocation(id) {
      this.transitionToRoute("vendors.show.location", id);
    },

    async createNewLocation(vendor) {
      const location = this.store.createRecord("location", {company: vendor, name});
      await location.save();

      this.transitionToRoute("vendors.show.location", location);
    }
  }
});
