import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default Component.extend({
  defaultIcon: new L.Icon.Default(),
  companyName: alias("model.address.locations.firstObject.company.name")
});
