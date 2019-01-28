import Service from '@ember/service';

export default Service.extend({
  preferencesData:{},
  startUp(){},
  setPreference(key, value){
    this.set(`preferencesData.${key}`, value);
  }
});
