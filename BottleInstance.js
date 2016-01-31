var Promise = require('bluebird');
var _ = require('underscore');
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
        console.log('#getAgents could not be performed', err);
      }
      console.log('#getAgents(skill:"fill")',reply);

      if(!_.isEmpty(reply)){
        _.each(reply, function(entry){
          console.log('getFillerLevel for', entry);
          BottleInstance.rpc.request(entry.agent, { method: 'getFillerLevel', params: ''})
            .then(function(fillerLevel){
              console.log(entry.agent, 'says he has', fillerLevel);
            });
        })
      }
    })
    .catch(function(err){
      console.log('catchedErr - #getAgents could not be performed',err);
    });
});
