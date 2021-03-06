import { isPresent } from '@ember/utils';
import { not, filterBy, equal, alias } from '@ember/object/computed';
import Model from "ember-data/model";
import attr from "ember-data/attr";
import {
  belongsTo,
  hasMany
} from "ember-data/relationships";

import activeState from "last-strawberry/constants/active-states";

export default Model.extend({
  name:                attr("string"),
  terms:               attr("number", { defaultValue: 14 }),
  isCustomer:          attr("boolean", { defaultValue: true}),
  isVendor:            attr("boolean", { defaultValue: false}),
  locationCodePrefix:  attr("string"),
  activeState:         attr("string", { defaultValue: activeState.ACTIVE}),

  priceTier:  belongsTo("price-tier"),
  locations:  hasMany("location"),
  items:      hasMany("item"),

  text:       alias("name"),
  isActive:   equal("activeState", activeState.ACTIVE),
  isArchived: not("isActive"),

  activeLocations: filterBy("locations", "active", true),

  async priceForItem(item) {
    const priceTier = await this.get("priceTier");

    if(isPresent(priceTier)) {
      return priceTier.priceForItem(item);
    } else {
      return item.get("defaultPrice");
    }
  }
});
