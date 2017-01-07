import Ember from "ember";
import computed from "ember-computed-decorators";

export default Ember.Component.extend({
  preferencesService: Ember.inject.service(),

  @computed("preferencesService.preferencesData", "settingsKey")
  isClosed(data, settingsKey) {
    let isClosed = false;
    if(Ember.isPresent(data)){
      isClosed = data[settingsKey];
    }

    return isClosed;
  },

  actions: {
    toggle() {
      this.set("isClosed", !this.get("isClosed"));
      this.get("preferencesService").setPreference(this.get("settingsKey"), this.get("isClosed"));
    }
  }
});
