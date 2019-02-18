import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';
import ItemTypes from "last-strawberry/constants/item-types";

export default Controller.extend({
  products: filterBy("items", "tag", ItemTypes.PRODUCT),
  actions: {
    saveItem(changeset) {
      changeset.save();
    },

    archiveItem(item) {
      item.set("active", false);
      item.save();
    },

		createNewProduct(name) {
      const item = this.store.createRecord('item', {name, tag:ItemTypes.PRODUCT, isSold:true, isPurchased:false});
			item.save();
    }
  }
});
