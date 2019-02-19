import $ from 'jquery';

import {
  create,
  clickable,
  fillable,
  visitable,
  text,
  value,
  hasClass,
  collection,
  is } from "ember-cli-page-object";

const page = create({
  visit: visitable("/customers/:company_id/locations/:location_id")
});

const itemSettingsPO = create({
  itemSettings: collection(".debug_sections_locations_item-setting", {
    label: text(".productName"),

    itemDesire: {
      scope: ".debug_ui_toggle-button",
      enabled: hasClass("selected"),
      toggle: clickable()
    },

    itemCreditRate: {
      scope: ".debug_ui_toggle-button",
      enabled: hasClass("selected")
    }
  })
});

const visitSchedulePO = create({
  visitWindows: collection(".debug_sections_locations_visit-window"),

  createNewVisitWindow: clickable(".createVisitWindow"),
  deleteVisitWindow: clickable(".deleteVisitWindow")
});

const visitDaysPO = create({
  dayOptions: collection(".debug_sections_locations_visit-schedule .debug_ui_label-checkbox", {
    label: text(".label"),
    enabled: hasClass("selected")
  })
});

const addressPO = create({
  scope: ".debug_sections_locations_address-manager",

  fillSearchAddress: fillable("input"),

  updateAddress: clickable(".submit"),

  fullAddress: value("input")
});

const notificationPO = create({
  firstName: value(".firstName"),
  fillFirstName: fillable(".firstName"),
  blurFirstName: () => $(".firstName").blur(),

  lastName: value(".lastName"),
  fillLastName: fillable(".lastName"),

  email: value(".email"),
  iswantsOrderChecked: is(":checked", ".wantsOrder"),
  isWantsCreditChecked: is(":checked", ".wantsCredit"),

  delete: clickable(".deleteButton")
});

const notificationListPO = create({
  addNotification: clickable(".createNotification"),

  notifications: collection(".notificationRow")
});

export {
  page,
  itemSettingsPO,
  visitSchedulePO,
  visitDaysPO,
  addressPO,
  notificationPO,
  notificationListPO
};
