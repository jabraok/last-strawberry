import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed("model.name")
  title() {
    const name = this.get("model.name");
    return `Deleting a price tier: ${name}`;
  },

  @computed("priceTiers.@each.{id}")
  switchingPriceTiers() {
    const priceTiers = this.get("priceTiers");
    const deletingId = this.get("model.id");
    return priceTiers.filter(priceTier => priceTier.get("id") !== deletingId);
  },

  @computed("switchingPriceTiers.[]")
  switchingPriceTier() {
    const switchingPriceTiers = this.get("switchingPriceTiers");
    let switchingPriceTier;
    if(switchingPriceTiers.length !== 0){
      switchingPriceTier = switchingPriceTiers[0];
    }

    return switchingPriceTier;
  },

  @computed("model.hasCompanies", "switchingPriceTier")
  isValid() {
    const hasCompanies = this.get("model.hasCompanies");
    const switchingPriceTier = this.get("switchingPriceTier");
    return isPresent(switchingPriceTier) || !hasCompanies;
  },

  actions: {
    submitDestroyPriceTier() {
      this.get("submit")(this.get("switchingPriceTier"));
      this.get("close")();
    }
  }
});
