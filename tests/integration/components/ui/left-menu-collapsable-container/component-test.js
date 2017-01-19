import { moduleForComponent, test } from "ember-qunit";
import hbs from "htmlbars-inline-precompile";

moduleForComponent("ui/left-menu-collapsable-container", "Integration | Component | ui/left menu collapsable container", {
  integration: true
});

test("it renders", function(assert) {
  this.render(hbs`{{ui/left-menu-collapsable-container}}`);
  assert.ok(true);
});
