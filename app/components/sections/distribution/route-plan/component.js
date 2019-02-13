import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import COLOR_SCHEMES from 'last-strawberry/constants/color-schemes';

export default Component.extend({
  classNames: ['col'],
  classNameBindings: ['indexStyle'],

  @computed('model.id')
  saveRoutePlanBlueprintDomId() {
    const id = this.get("model.id");
    return `saveRoutePlanBlueprint-${id}`
  },

  @computed("index")
  colorScheme() {
    const index = this.get("index") || 0;
    return COLOR_SCHEMES[index];
  },

  actions: {
    delete() {
      this.get("destroyRoutePlan")(this.get('model'));
    },

    saveRoutePlanBlueprint() {
      this.get("saveRoutePlanBlueprint")(this.get('model'), this.$('.saveRoutePlanBlueprint'));
    }
  }
});
