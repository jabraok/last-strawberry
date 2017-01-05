import Ember from "ember";

export default Ember.Component.extend({
  preferencesService: Ember.inject.service(),

  classNames: ["col", "card-1"],

  actions: {
    noteChanged(e) {
      this.set("locationNote", e.target.value);
    },

    testClick() {
      this.get("preferencesService").togglePreferene();
    }
  }
});
