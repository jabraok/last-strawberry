import { moduleForModel, test } from 'ember-qunit';

moduleForModel('address', 'Unit | Model | address', {
  integration: true
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
