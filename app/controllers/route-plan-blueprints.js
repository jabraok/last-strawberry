import Controller from '@ember/controller';
import { filterBy } from '@ember/object/computed';

export default Controller.extend({
  drivers: filterBy("users", "isDriver", true),

  actions: {
		saveRoutePlanBlueprint(id, name, driver) {
			const routePlanBlueprint = this.store.peekRecord("route-plan-blueprint", id);
			routePlanBlueprint.set("name", name);
			routePlanBlueprint.set("user", driver);

			routePlanBlueprint.save();
		},

		deleteRoutePlanBlueprint(routePlanBlueprint) {
			routePlanBlueprint.destroyRecord();
		}
  }
});
