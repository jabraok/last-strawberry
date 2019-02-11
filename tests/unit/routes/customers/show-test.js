import { moduleFor, test } from 'ember-qunit';

moduleFor('route:customers/show', 'Unit | Route | customers/show', {
  integration: true
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
