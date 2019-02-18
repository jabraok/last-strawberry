import Controller from '@ember/controller';
import { updateModelField, saveModelIfDirty } from "last-strawberry/actions/model-actions";

export default Controller.extend({
  actions: {
    updateModelField,
    saveModelIfDirty,

    destroyPriceTier(model, switchingPriceTier) {
      model.destroyRecord();

      model.get("companies")
        .forEach(company => {
          company.set("priceTier", switchingPriceTier);
          company.save();
        });

      this.transitionToRoute("price-tiers");
    }
  }
});
