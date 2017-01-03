import Ember from "ember";
import computed from "ember-computed-decorators";

export default Ember.Component.extend({
  classNames: ["col", "card-1"],
  page:"sales_orders",
  isHidden:true,

  async willRender(){
    let isHidden = await localforage.getItem(this.get("LSKey"));
    if(!Ember.isPresent(isHidden)){
      isHidden = true;
    }
      this.set("isHidden", isHidden);
  },

  @computed("page")
  LSKey(page){
    return page + "_location_note_is_close";
  },

  actions: {
    noteChanged(e) {
      this.set("locationNote", e.target.value);
    },

    toggleOpenClose(){
      this.set("isHidden", !this.get("isHidden"));
      localforage.setItem(this.get("LSKey"), this.get("isHidden"));
    }
  }
});
