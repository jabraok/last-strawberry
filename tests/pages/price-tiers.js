import {
  create,
  collection,
  text,
  value,
  visitable,
  clickable,
  fillable } from "ember-cli-page-object";

const index = create({

  visit: visitable('/price-tiers'),

  priceTiers: collection('.listRow', {
    scope: '.debug_lists_filterable-label-list',
    label: text('.name')
  }),

  fillNewPriceTierInput: fillable('.debug_ui_input-action-bar input'),
  submitNewPriceTier: clickable('.debug_ui_input-action-bar .debug_ui_icon-button')
});

const show = create({
  scope: '.priceTierContainer',
  visit: visitable('/price-tiers/:id'),
  name: value('.priceTierName input'),

  openPriceRows: collection('.openItemPricesContainer .debug_ui_price-row', {
    itemName: text('.name'),
    price: text('.price')
  }),

  fulfilledPriceRows: collection('.fulfilledItemPricesContainer .debug_ui_price-row', {
    itemName: text('.name'),
    price: text('.price')
  }),

  priceRows: collection('.debug_ui_price-row', {
    itemName: text('.name'),
    price: text('.price')
  }),

  companyRows: collection('.companyRow', {
    scope: '.debug_modals_base-modal',
    resetScope: true
  }),

  clickDeleteButton: clickable('.buttonDelete'),
  submitDeletePriceTier: clickable(".debug_modals_base-modal .submit", { resetScope: true }),

  selectPriceTier(priceTier) {
    return selectChoose(".switchingPriceTierContainer", priceTier.get("name"));
  }
});

export { index, show };
