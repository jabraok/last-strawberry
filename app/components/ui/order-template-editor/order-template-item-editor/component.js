import Ember from 'ember';
import { computed } from '@ember-decorators/object';;

export default Ember.Component.extend({
  classNames: ['row'],

  @computed('index')
  formattedIndex(index) {
    const num = S(index + 1).padLeft(2, '0').s;
    return `${num}.`;
  }
});
