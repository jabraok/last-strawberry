import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { make, manualSetup } from 'ember-data-factory-guy';

moduleForComponent('sections/items/item-editor', 'Integration | Component | sections/items/item editor', {
  integration: true,

  beforeEach: function () {
    manualSetup(this.container);
  }
});

test('it renders the item fields', function(assert) {
  let item = make('item');

  this.set('model', item);
  this.set('saveModel', ()=>{});

  this.render(hbs`{{sections/items/item-editor
    model=model
    saveModel=(action saveModel)
  }}`);

  assert.equal(this.$('.name').val(), item.get('name'));
  assert.equal(this.$('.description').val(), item.get('description'));
});
