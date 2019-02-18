import Controller from '@ember/controller';
import { notEmpty, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import ItemTypes from "last-strawberry/constants/item-types";
import NotificationRenderer from "last-strawberry/constants/notification-renderers";
import PublishedStates from "last-strawberry/constants/published-states";

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
    },
    updateShipping(value) {
			const cleaned = parseFloat(value) || 0;
			const order = this.get('model');
			order.set("shipping", cleaned);
		},

		saveOrder() {
			const order = this.get('model');
			order.save();
		},

		emailOrder(model) {
			const notificationRules = model.get("location.notificationRules");
			const notifications = model.get('notifications');
			const renderer = isEmpty(notifications) ? NotificationRenderer.PURCHASE_ORDER : NotificationRenderer.UPDATED_PURCHASE_ORDER

			notificationRules.forEach(nr => {
				const notification = this.store.createRecord("notification", {
					renderer,
					order: model,
					notificationRule: nr
				});

				notification.save();
			});
		},

		async createNewItem(changeset) {
			const record = await this.store
				.createRecord("item", {
					company: changeset.get("company"),
					name: changeset.get("name"),
					code: changeset.get("code"),
					description: changeset.get("description"),
					unitOfMeasure: changeset.get("unitOfMeasure"),
					defaultPrice: changeset.get("defaultPrice"),
					tag: ItemTypes.INGREDIENT })
				.save();

				return record;
		},

		async createOrderItem(item) {
			const order = this.get('model');
			const unitPrice = item.get("defaultPrice");
			this.store
				.createRecord("order-item", {item, order, unitPrice})
				.save();
		},

		updateOrderItem(model, key, val) {
			model.set(key, val);
		},

		async saveOrderItem(orderItem) {
			if(orderItem.get("hasDirtyAttributes")) {

				return orderItem
					.save()
					.catch(() => orderItem.rollbackAttributes());
			}
		},

		async deleteOrderItem(model) {
			model.destroyRecord();
		},

		async deleteOrder(model) {
			await model.destroyRecord();

			this.transitionToRoute("purchase-orders");
		},

		toggleOrderState(model) {
			const updatedState = model.get("isUnpublished") ? PublishedStates.PUBLISHED : PublishedStates.UNPUBLISHED;
			model.set("publishedState", updatedState);

			model.save()
		},

		saveLocationNote(location, locationNote){
			const locationModel = location.content;

			locationModel.set("note", locationNote);
			locationModel.save();
		},

		updateDeliveryDate(order, newDate) {
			const formattedDate = moment(newDate).format("YYYY-MM-DD");

			if(order.get("deliveryDate") !== formattedDate){
				order.set("deliveryDate", formattedDate);
				order.save();
			}
		}
  }
});
