import Ember from "ember";

export default Ember.Service.extend({
  async getItem(key){
    return await localforage.getItem(key);
  },

  async setItem(key, value){
    await localforage.setItem(key, value);
  }
});
