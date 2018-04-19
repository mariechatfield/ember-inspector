import Component from '@ember/component';
import { run } from '@ember/runloop';
import { observer } from '@ember/object';
import { getOwner } from '@ember/application';
import { alias } from '@ember/object/computed';

export default Component.extend({
  selectedApp: alias('port.applicationId'),

  selectedDidChange: observer('selectedApp', function() {
    // Change iframe being debugged
    let url = '/';
    let applicationId = this.get('selectedApp');
    let list = this.get('port').get('detectedApplications');
    let app = getOwner(this).lookup('application:main');

    run(app, app.reset);
    let router = app.__container__.lookup('router:main');
    let port = app.__container__.lookup('port:main');
    port.set('applicationId', applicationId);
    port.set('detectedApplications', list);

    // start
    app.boot().then(() => {
      router.location.setURL(url);
      run(app.__deprecatedInstance__, 'handleURL', url);
    });
  }),

  actions: {
    selectIframe(applicationId) {
      this.set('selectedApp', applicationId);
    }
  }
});
