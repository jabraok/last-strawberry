import Ember from "ember";

export default Ember.Component.extend({
  preferencesService: Ember.inject.service(),

  isClosedDynamicComputed: function() {
          return Ember.Object.extend({
               value: Ember.computed.alias(`preferencesService.preferencesData.${this.get("settingsKey")}`)
          }).create({preferencesService: this.get("preferencesService")});
    }.property("preferencesService", "settingsKey"),

  isClosed: Ember.computed.alias("isClosedDynamicComputed.value"),

  // isClosed: Ember.computed.alias("preferencesService.preferencesData.itemTotalsIsClosed"),

 //  willRender() {
 //   this._super(...arguments);
 //
 //   console.log(this.get("preferencesService").getItem("ee"));
 // },

  // init() {
  //
  //     this._super();
  //     console.log(this.get("preferencesService.preferencesData.itemTotalsIsClosed"));
  // },

  //

  // isClosed: Ember.computed("preferencesService.preferencesData", function() {
  //   let isClosed = false;
  //   console.log("out");
  //   if(Ember.isPresent(this.get("preferencesService.preferencesData"))){
  //       console.log("in");
  //     isClosed = this.get(`preferencesService.preferencesData.${this.get("settingsKey")}`);
  //   }
  //   return isClosed;
  // }),

  actions: {
    toggle() {
      // this.set("isClosed", !this.get("isClosed"));
      // this.get("preferencesService").setPreference(this.get("settingsKey"), this.get("isClosed"));

      this.get("preferencesService").setPreference(this.get("settingsKey"), !this.get("isClosed"));
    }
  }
});
