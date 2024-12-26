const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'quarters',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

