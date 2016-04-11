import { test } from 'qunit';
import moduleForAcceptance from 'last-strawberry/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'last-strawberry/tests/helpers/ember-simple-auth';
import page from 'last-strawberry/tests/pages/distribution';
import { make, makeList, mockDelete, mockFindAll } from 'ember-data-factory-guy';

moduleForAcceptance('Acceptance | distribution');

test('visiting distribution defaults to tomorrows date', async function(assert) {
  authenticateSession(this.application);

  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

  await page.visit({date:tomorrow});

  assert.equal(currentURL(), `/distribution?date=${tomorrow}`);
});

test('orders display when there are valid orders', async function(assert) {
  authenticateSession(this.application);

  mockFindAll('order', 10);

  await page.visit();

  assert.equal(page.orderGroups().count, 10);
});

test('cannot create route plans when no orders are present', async function(assert) {
  authenticateSession(this.application);

  await page
    .visit()
    .createRoutePlan();

  assert.equal(page.routePlans().count, 0);
});

test('admins can create route plans when orders are present', async function(assert) {
  authenticateSession(this.application);

  mockFindAll('order', 10);

  await page
    .visit()
    .createRoutePlan();

  assert.equal(page.routePlans().count, 1);
});

test('admins can delete route plans', async function(assert) {
  assert.expect(2);

  authenticateSession(this.application);

  const routeVisits = makeList('order', 5).map(o => make('route-visit', {visitWindow:o.get('location.defaultVisitWindow')}));
  make('route-plan', {routeVisits});
  
  await page.visit();

  assert.equal(page.routePlans().count, 1);

  mockDelete('route-plan', 1);
  await page.deleteLastRoutePlan();

  assert.equal(page.routePlans().count, 0);
});

test('admins can delete individual route visit', async function(assert) {
  authenticateSession(this.application);

  const routeVisits = makeList('order', 5).map(o => make('route-visit', {visitWindow:o.get('location.defaultVisitWindow')}));
  make('route-plan', {routeVisits});

  await page.visit();

  assert.equal(page.routePlans(0).routeVisits().count, 5);

  mockDelete('route-visit', 1);
  await page.routePlans(0).routeVisits(0).delete();

  assert.equal(page.routePlans(0).routeVisits().count, 4);
});
