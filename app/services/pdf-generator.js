import $ from 'jquery';
import { Promise, reject } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import config from 'last-strawberry/config/environment';

export default Service.extend({
  session: service(),

  generateInvoices(orders = []) {
    const orderNumbers = orders.map(order => order.get('orderNumber'));

    if(isPresent(orderNumbers)) {
      return new Promise((res, rej) => {
        this.get('session').authorize('authorizer:devise', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          const payload = {
            url:`${config.apiHost}/orders/generate_pdf`,
            data:{orders:orderNumbers},
            headers,
            type:'POST'
          };

          $.ajax(payload)
            .done(res)
            .fail(rej)
        });
      });
    } else {
      return reject('No invoices were supplied');
    }
  },

  printFulfillmentDocuments(routePlans = []) {
    const routePlanIds = routePlans.map(routePlan => routePlan.get('id'));

    if(isPresent(routePlanIds)) {
      return new Promise((res, rej) => {
        this.get('session').authorize('authorizer:devise', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          const payload = {
            url:`${config.apiHost}/documents/generate_packing_documents`,
            data:{route_plans:routePlanIds},
            headers,
            type:'POST'
          };

          $.ajax(payload)
            .done(res)
            .fail(rej)
        });
      });
    } else {
      return reject('No route plans were supplied');
    }
  }
});
