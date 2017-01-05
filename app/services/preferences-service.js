import Ember from "ember";

export default Ember.Service.extend({

  async init() {
    // Load preferences data
    const preferencesData = new Object();

    const keys = await localforage.keys();
    keys.forEach(async key => {
        const value = await localforage.getItem(key);
        preferencesData[key] = value;
    });

    this.set("preferencesData", preferencesData);

    console.log(this.get("preferencesData"));
  },

  async setPreference(key, value){
    await localforage.setItem(key, value);

    // Set preferences data
    const preferencesData = this.get("preferencesData");
    preferencesData[key] = value;
  },

  togglePreferene(key){
   const value = await localforage.getItem(key);
    // debugger;
  }
});
