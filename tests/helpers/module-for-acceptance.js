import { module } from 'qunit';
import { resolve } from 'rsvp';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import { mockSetup, mockTeardown, getPretender } from 'ember-data-factory-guy';
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

      mockSetup();

      // Enable for mockjax logging
      // $.mockjaxSettings.logging = true;
      // $.mockjaxSettings.logging = 4;

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return resolve(afterEach)
        .then(() => destroyApp(this.application))
        .then(() => mockTeardown());
    }
  });
}
