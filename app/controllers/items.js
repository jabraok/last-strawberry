import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';
import ItemTypes from "last-strawberry/constants/item-types";

export default Controller.extend({
  ingredients: filterBy("items", "tag", ItemTypes.INGREDIENT),
  actions: {
		saveItem(changeset) {
      changeset.save();
    },

    archiveItem(item) {
      item.set("active", false);
      item.save();
    }
  }
});
