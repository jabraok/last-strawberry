import Ember from "ember";
import computed from "ember-computed-decorators";

export default Ember.Component.extend({
  classNames: ["col", "stretch"],

  @computed("isHidden")
  cssClass(isHidden) {
    let cssClass = "hide show-gt-sm";
    return cssClass;
  },

  actions: {
    toogle(){
      this.set("isHidden", !this.get("isHidden"));
    }
  }
});
