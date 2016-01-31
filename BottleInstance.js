var Promise = require('bluebird');
var eve = require('evejs');
var BottleAgent = require('./agents/BottleAgent');

eve.system.init({
  transports: [
    {
      type: 'amqp',
      url: 'amqp://localhost'
    }
  ]
});

// create two agents
var BottleInstance = new BottleAgent('Bottle1', 200);

Promise.all([BottleInstance.ready]).then(function () {
  // Register skill

  BottleInstance.rpc.request('DF',{method: 'getAgents', params: {skill: 'fill'}})
    .then(function(reply){
      if(reply.err){
        console.log('skill "fill" could not be registered');
      }
      console.log('#getAgents(skill:fill)',reply);


    })
    .catch(function(err){
      console.log('catchedErr',err);
    });
});
