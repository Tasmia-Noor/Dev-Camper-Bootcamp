const NodeGeocoder = require('node-geocoder');

const options = {
  // provider: process.env.GEOCODER_PROVIDER,
  provider: 'mapquest',
  httpAdapter:'https',
  apiKey:'nPYO7gGYhegrx5SaAIIcSIVxe3cSigO4', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
module.exports= geocoder