import { moduleForModel, test } from 'ember-qunit';

moduleForModel('item', 'Unit | Model | item', {
  integration: true
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
