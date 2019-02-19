import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";
import {
  make,
  makeList,
  manualSetup
} from "ember-data-factory-guy";
import { notificationListPO as page } from "last-strawberry/tests/pages/customers-show-location";
import { create } from 'ember-cli-page-object';

moduleForComponent("sections/locations/notification-rules", "Integration | Component | sections/locations/notification rules", {
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
  let location = make("location");
  location.set("notificationRules", makeList("notification-rule", 3));

  this.set("model", location);
  this.set("handler", () => {});

  this.render(hbs`{{sections/locations/notification-rules
          model=model
          createNotification=handler
          saveNotification=handler
          deleteNotification=handler}}`);

  assert.equal(page.notifications.length, 3);
});

test("it triggers createNotification when click on add rule button", async function(assert) {
  assert.expect(1);

  let location = make("location");

  this.set("model", location);
  this.set("handler", () => {});
  this.set("createNotification", () => {
    assert.ok(true);
  });

  await this.render(hbs`{{sections/locations/notification-rules
  model=model
  createNotification=createNotification
  saveNotification=handler
  deleteNotification=handler}}`);

  page.addNotification();
});
