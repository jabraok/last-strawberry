import { moduleForModel, test } from 'ember-qunit';

moduleForModel('company', 'Unit | Model | company', {
  integration: true
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
