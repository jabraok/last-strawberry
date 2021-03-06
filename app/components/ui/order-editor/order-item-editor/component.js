import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['section_sales-order_order-item-editor', 'row'],
  classNameBindings:['highlighted'],

  _blur() {
    this.set('highlighted', false);
    this.get("save")(this.get('model'));
  },

  actions: {
    onFocus() {
      this.set('highlighted', true);
      this.get("onOrderItemChange")(this.get('model.item'));
    },

    onBlur() {
      if(!this.get('model.quantity')){
        this.set('model.quantity', 0)
      }

      this._blur();
    },

    onBlurUnitPrice() {
      if(!this.get('model.unitPrice')){
        this.set('model.unitPrice', 0)
      }

      this._blur();
    }
  },

  formattedIndex: computed('index', function() {
    const index = this.get("index");
    const num = S(index + 1).padLeft(2, '0').s;
    return `${num}.`;
  })
});
