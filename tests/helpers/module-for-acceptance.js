import { module } from 'qunit';
import startApp from '../helpers/start-app';
import { getPretender } from 'ember-data-factory-guy';
import preferencesMock from '../mocks/preferences-service';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {

      this.application = startApp();

      // Mock preferencesService
      this.application.register('service:mockPreferences', preferencesMock);
      this.application.inject('component', 'preferencesService', 'service:mockPreferences');

      getPretender().post('https://andruxnet-random-famous-quotes.p.mashape.com/*', () => {
        let quotes =  JSON.stringify({"quote":"Houston, we have a problem.","author":"Apollo 13","category":"Movies"});
        return [200, {}, quotes]
      });

      getPretender().get('https://api.mapbox.com/*', () => [200, {}, ""]);

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    }
  })
}
