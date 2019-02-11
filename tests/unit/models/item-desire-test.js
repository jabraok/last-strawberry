import { moduleForModel, test } from 'ember-qunit';

moduleForModel('item-desire', 'Unit | Model | item desire', {
  integration: true
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
