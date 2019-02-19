import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import {
  make,
  makeList,
  manualSetup
} from "ember-data-factory-guy";
import { notificationsPO as page } from "last-strawberry/tests/pages/sales-orders-show";
import { create } from 'ember-cli-page-object';

moduleForComponent("ui/order-editor/notifications", "Integration | Component | ui/order editor/notifications", {
  integration: true,

  beforeEach: function () {
    this.page = create({context: this});
    manualSetup(this.container);
  },

  afterEach() {
    page.removeContext();
  }
});

test("it shows notification list when present", function(assert) {
  const notifications = makeList("notification", 3);

  this.set("notifications", notifications);

  this.render(hbs`{{ui/order-editor/notifications
                    notifications=notifications}}`);

  assert.equal(page.notifications().count, 3);
});

test("it shows id and notificationState and renderer", function(assert) {
  const notification = make("notification");

  this.set("notifications", [notification]);

  this.render(hbs`{{ui/order-editor/notifications
                    notifications=notifications}}`);

  const firstRow = page.notifications(0);

  assert.equal(firstRow.id, notification.get("id"));
  assert.equal(firstRow.notificationState, notification.get("notificationState"));
  assert.equal(firstRow.renderer, notification.get("renderer"));
});
