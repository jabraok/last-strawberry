import Controller from '@ember/controller';
import { notEmpty, alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  hasDataPath: notEmpty("dataPath"),

  company: alias("model.location.company"),

  filteredItems: computed("items.@each.{active}", "company.id", function() {
    const items = this.get("items");
    const companyId = this.get("company.id");
    return items
      .filter(item => {
        const isTheSameCompany = item.get("company.id") === companyId;

        return item.get("active") && isTheSameCompany;
      })
      .sortBy("name");
  }),

  dataPath: computed("item.name", "model.location.id", function() {
    const name = this.get("item.name");
    const id = this.get("model.location.id");
    if(name) {
      return `locations/${id}/${name}`;
    } else {
      return undefined;
    }
  }),

  actions: {
    onOrderItemChange(item) {
      this.set("item", item);
    }
  }
});
