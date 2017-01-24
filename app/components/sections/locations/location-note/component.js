import Ember from "ember";

export default Ember.Component.extend({
  classNames: ["col"],

  actions: {
    noteChanged(e) {
      this.set("locationNote", e.target.value);
    }
  }
});
