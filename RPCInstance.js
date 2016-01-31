var Promise = require('bluebird');
var eve = require('evejs');
var RPCAgent = require('./agents/RPCAgent');

eve.system.init({
  transports: [
    {
      type: 'http',
      url: 'http://127.0.0.1:3000/agents/:id', // URL for this instance server
      remoteUrl: 'http://127.0.0.1:3000/agents/:id', // URL for the server where to look for agents
      localShortcut: false,
      default: true,
    },
    {
      type: 'amqp',
      host: 'dev.rabbitmq.com',
    }
  ]
});

// create two agents
var agent1 = new RPCAgent('agent1');
var agent2 = new RPCAgent('agent2');

// once both agents are connected, send a message to agent1
Promise.all([agent1.ready, agent2.ready]).then(function () {


// catch error, send a message to a non-existing agent will fail
  agent2.rpc.request('agent1', {method: 'add', params: {a: 1, b: 2, description: 'hi there'}})
    .then(function (reply) {
      console.log('reply',reply);
    })
    .catch(function (err) {
      console.log('err',err)
    });
});
