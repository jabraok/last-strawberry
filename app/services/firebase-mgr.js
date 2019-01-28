import Service from '@ember/service';
import config from 'last-strawberry/config/environment';

export default Service.extend({
  client: new Firebase(config.firebase.host),
  buildRef(path) {
    return this.get('client').child(path);
  }
});
