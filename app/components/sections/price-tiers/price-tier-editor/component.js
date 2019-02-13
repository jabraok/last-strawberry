import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed("model.itemPrices.@each.{isPending}")
  openItemPrices() {
    const itemPrices = this.get("model.itemPrices") || [];
    return itemPrices.filter(ip => ip.get("isPending"));
  },

  @computed("model.itemPrices.@each.{isActive}")
  fulfilledItemPrices() {
    const itemPrices = this.get("model.itemPrices") || [];
    return itemPrices.filter(ip => ip.get("isActive"));
  },

  actions: {
    onRequestDestroyPriceTier() {
      this.set("showDestroyPriceTierModal", true);
    },

    closeDestroyPriceTier() {
      this.set("showDestroyPriceTierModal", false);
    },

    destroyPriceTier(switchingPriceTier){
      this.get("destroyPriceTier")(this.get("model"), switchingPriceTier);
      this.set("showDestroyPriceTierModal", false);
    }
  }
});
