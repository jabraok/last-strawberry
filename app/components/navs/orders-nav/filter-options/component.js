import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  isHidden:true,

  @computed("isHidden")
  title() {
    const isHidden = this.get("isHidden");
    return isHidden? "Show Filter Options": "Hide Filter Options";
  }
});
