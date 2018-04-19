import Evented from '@ember/object/evented';
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend(Evented, {
  applicationId: undefined,

  detectedApplications: computed(function() {
    return [];
  }),

  init() {
    const detectedApplications = this.get('detectedApplications');
    this.get('adapter').onMessageReceived(message => {
      if (!message.applicationId) {
        return;
      }
      if (!this.get('applicationId')) {
        this.set('applicationId', message.applicationId);
      }
      // save list of application ids
      if (!detectedApplications.findBy('value', message.applicationId)) {
        detectedApplications.pushObject({
          name: message.name || message.applicationId.split('__')[1],
          value: message.applicationId
        });
      }

      const applicationId = this.get('applicationId');
      if (applicationId === message.applicationId) {
        this.trigger(message.type, message, applicationId);
      }
    });
  },
  send(type, message) {
    message = message || {};
    message.type = type;
    message.from = 'devtools';
    message.applicationId = this.get('applicationId');
    this.get('adapter').sendMessage(message);
  }
});
