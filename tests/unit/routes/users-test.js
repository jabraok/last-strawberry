import { moduleFor, test } from 'ember-qunit';

moduleFor('route:users', 'Unit | Route | users', {
  integration: true
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
