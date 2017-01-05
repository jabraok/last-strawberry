import Ember from "ember";

export default Ember.Component.extend({
  actions: {
    toggle() {
      debugger;
      this.attrs.toggle();
    }
  }
});
