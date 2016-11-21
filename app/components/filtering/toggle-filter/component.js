import Ember from "ember";

export default Ember.Component.extend({
  actions: {
    toggled(option, val) {
      Ember.set(option, "selected", val);
      if(this.attrs.toggled) {
        this.attrs.toggled(option);
      }
    }
  }
});
