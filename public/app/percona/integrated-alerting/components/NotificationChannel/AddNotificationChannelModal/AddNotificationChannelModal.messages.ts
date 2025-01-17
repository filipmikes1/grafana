export const Messages = {
  title: 'Add Notification Channel',
  fields: {
    name: 'Name',
    type: 'Type',
    addresses: 'Addresses',
    addressesPlaceholder: 'example1@percona.com\nexample2@percona.com\nexample3@percona.com',
    routingKey: 'Routing key',
    serviceKey: 'Service key',
    channel: 'Channel',
    authType: 'Authorization Type',
    basic: 'Basic',
    token: 'Bearer Token',
    noAuth: 'No Authorization',
    url: 'URL',
    tlsSettings: 'TLS Settings',
    ca: 'CA Certificate',
    certificate: 'Certificate',
    certKey: 'Certificate Key',
    serverName: 'Server Name',
    skipVerify: 'Skip TLS certificate verification',
    sendResolved: 'Notify about resolved alerts',
    maxAlerts: 'Maximum number of alerts to include in message (0 = all)',
    username: 'Username',
    password: 'Password',
  },
  addAction: 'Add',
  editAction: 'Save',
  cancelAction: 'Cancel',
  emailOption: 'Email',
  pagerDutyOption: 'Pager Duty',
  slackOption: 'Slack',
  webHookOption: 'Webhook',
  addSuccess: 'Notification channel was successfully added',
  editSuccess: 'Notification channel was successfully edited',
  invalidChannelName: "Channel shouldn't have # character.",
};
