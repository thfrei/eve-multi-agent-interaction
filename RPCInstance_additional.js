var Promise = require('bluebird');
var eve = require('evejs');
var RPCAgent = require('./agents/RPCAgent');

eve.system.init({
  transports: [
    {
      type: 'http',
      url: 'http://127.0.0.1:3001/agents/:id',
      remoteUrl: 'http://127.0.0.1:3000/agents/:id',
      localShortcut: false,
      default: true
    }
  ]
});

// create two agents
var agent3 = new RPCAgent('agent3');

// once both agents are connected, send a message to agent1
Promise.all([agent3.ready]).then(function () {

// catch error, send a message to a non-existing agent will fail
  agent3.rpc.request('agent1', {method: 'add', params: {a: 5, b: 2}})
    .then(function (reply) {
      console.log(reply);
    })
    .catch(function (err) {
      console.log(err)
    });

});
