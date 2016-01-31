var Promise = require('bluebird');
var eve = require('evejs');
var DFAgent = require('./agents/DFAgent');

eve.system.init({
  transports: [
    {
      type: 'amqp',
      host: 'localhost'
    }
  ]
});

// create two agents
var DF = new DFAgent('DF');

Promise.all([DF.ready]).then(function () {
  console.log('DF ready');
});
