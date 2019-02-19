import {
  create,
  clickable,
  collection,
  text,
  visitable } from "ember-cli-page-object";

export default create({
  visit: visitable('/items'),

  createNewItem: clickable('.add'),

  items: collection('.debug_sections_items_item-table_table-row', {
    title: text('.debug_passive_title-bar .span')
  })
});
