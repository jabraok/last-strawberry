import Ember from "ember";
import computed from "ember-computed-decorators";

export default Ember.Component.extend({
  preferencesService: Ember.inject.service(),
  classNames: ["col"],

  isSmallExpanded: Ember.computed.alias("preferencesService.preferencesData.isSmallExpanded"),
  isLargeCollapsed: Ember.computed.alias("preferencesService.preferencesData.isLargeCollapsed"),

  @computed("isSmallExpanded", "isLargeCollapsed")
  cssClass(isSmallExpanded, isLargeCollapsed) {
    let cssClass = "hide show-gt-sm";

    if(isSmallExpanded){
      cssClass = "show";
    }

    if(isLargeCollapsed){
      cssClass = "hide";
    }

    return cssClass;
  },

  actions: {
    toggleLargeScreen() {
      this.get("preferencesService").setPreference("isLargeCollapsed", !this.get("isLargeCollapsed"));

      // Collapse small screen if large screen is collapsed
      if(this.get("isLargeCollapsed")){
          this.get("preferencesService").setPreference("isSmallExpanded", false);
      }
    },

    toggleSmallScreen() {
      this.get("preferencesService").setPreference("isSmallExpanded", !this.get("isSmallExpanded"));

      // Expand large screen if small screen is expanded
      if(this.get("isSmallExpanded")){
          this.get("preferencesService").setPreference("isLargeCollapsed", false);
      }
    }
  }
});
