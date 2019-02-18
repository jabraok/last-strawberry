import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import NotificationRenderer from "last-strawberry/constants/notification-renderers";
import PublishedStates from "last-strawberry/constants/published-states";

export default Controller.extend({
  firebaseMgr: service(),

  cleanup() {
    if(this.locationItemMetaStream !== undefined){
      this.locationItemMetaStream.onCompleted();
    }
  },

  processSnapshot(snapshot) {
    const data = snapshot.val();

    this.set("loadingFbData", false);
    this.set("rawSalesData", _.map(data));
  },

  willDestroy() {
    this.cleanup();
  },

  filteredItems: computed("items.@each.{isSold,active}", function() {
    const items = this.get("items");
    return items
      .filter(item => item.get("isSold") && item.get("active"))
      .sortBy("name");
  }),

  itemTotals: computed("salesOrders.@each.{totalQuantity}", function() {
    const orders = this.get("salesOrders") || A();
    return _
      .chain(orders.toArray())
      .map(order => order.get("orderItems").toArray())
      .flatten()
      .groupBy(orderItem => orderItem.get("item.id"))
      .mapValues(orderItems => orderItems.reduce((acc, cur) => acc + Number(cur.get("quantity")), 0))
      .map((quantity, id) => ({id, quantity}))
      .reduce((acc, cur) => {
        acc[cur.id] = cur.quantity;
        return acc;
      }, {})
      .value();
  }),

  salesData: computed("rawSalesData.@each.{ts}", function() {
    const dataPoints = this.get("rawSalesData") || [];
    return dataPoints.sortBy("ts");
  }),

  loadSalesData() {
    this.cleanup();
    this.set("loadingFbData", true);

    const itemCode = this.get("item.code"),
          locationCode = this.get("model.location.code"),
          dataPath = `locations/${locationCode}/${itemCode}`,
          fbRef = this.get("firebaseMgr").buildRef(dataPath).orderByChild("ts").limitToLast(10);

    this.locationItemMetaStream = new Rx.Subject();

    this.locationItemMetaStream
      .subscribe(
        () => fbRef.on("value", this.processSnapshot.bind(this), this.errorHander, this),
        () => {},
        () => fbRef.off("value", this.processSnapshot.bind(this), this));

    this.locationItemMetaStream.onNext();
  },

  actions: {
    onOrderItemChange(item) {
      this.set("item", item);
      this.loadSalesData();
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

		async createOrderItem(item) {
			const order = this.get('model');
			const company = await order.get("location.company");

			const unitPrice = await company.priceForItem(item);
			this.store
				.createRecord("order-item", {item, order, unitPrice})
				.save();
		},

		updateOrderItem(model, key, val) {
			model.set(key, val);
		},

		saveOrderItem(model) {
			if(model.get("hasDirtyAttributes")) {
				return model
					.save()
					.catch(() => model.rollbackAttributes());
			}
		},

		deleteOrderItem(model) {
			model.destroyRecord();
		},

		deleteOrder(model) {
			model.destroyRecord();
			this.transitionToRoute("sales-orders");
		},

		emailOrder(model) {
			const notificationRules = model.get("location.notificationRules");
			const notifications = model.get("notifications");
			const renderer = isEmpty(notifications) ? NotificationRenderer.SALES_ORDER : NotificationRenderer.UPDATED_SALES_ORDER

			notificationRules.forEach(nr => {
				const notification = this.store.createRecord("notification", {
					renderer,
					order: model,
					notificationRule: nr
				});

				notification.save();
			});
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
