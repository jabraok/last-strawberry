import { moduleForModel, test } from "ember-qunit";

moduleForModel("location", "Unit | Model | location", {
  integration: true
});

test("it exists", function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
