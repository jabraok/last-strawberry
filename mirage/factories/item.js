import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name: () => faker.commerce.productName()
});