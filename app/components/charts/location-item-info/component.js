import Ember from "ember";
import computed from "ember-computed-decorators";
const { notEmpty } = Ember.computed;

export default Ember.Component.extend({
  localStorage: Ember.inject.service(),
  
  classNames: ["col", "spaceBetween", "card-1"],
  classNameBindings: ["hasItem::hidden"],
  hasData:        notEmpty("salesData"),
  hasItem:        notEmpty("item"),
  hasLastUpdated: notEmpty("salesData.ts"),
  page:"sales_orders",
  isHidden:true,

  async willRender(){
    let isHidden = await this.get("localStorage").getItem(this.get("LSKey"));
    if(!Ember.isPresent(isHidden)){
      isHidden = true;
    }
      this.set("isHidden", isHidden);
  },

  @computed("page")
  LSKey(page){
    return page + "_location_item_info_is_close";
  },

  @computed("salesData.ts")
  lastUpdated(timestamp) {
    return moment.unix(timestamp);
  },

  actions: {
    toggleOpenClose(){
      this.set("isHidden", !this.get("isHidden"));
      this.get("localStorage").setItem(this.get("LSKey"), this.get("isHidden"));
    }
  }
});
