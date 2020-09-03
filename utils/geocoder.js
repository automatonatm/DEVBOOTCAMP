const  nodeGoecoder  = require('node-geocoder');


const options = {
    provider: 'mapquest',
    apiKey: 'L0ZLbdItgWie4PnYIvI1SjhjazBEWrNj', // for Mapquest, OpenCage, Google Premier
    httpAdapter: 'https',
    formatter: null // 'gpx', 'string', ...
};


const  geocoder = nodeGoecoder(options);

module.exports = geocoder;