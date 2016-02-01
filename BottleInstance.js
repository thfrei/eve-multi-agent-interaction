var Promise = require('bluebird');
var _ = require('underscore');
var program = require('commander');
var eve = require('evejs');
var BottleAgent = require('./agents/BottleAgent');

program
  .version('0.0.2')
  .option('-a, --agent-name <name>', 'Agent name: e.g. BottleAgent5', /^(\w*)$/i, 'BottleAgent1') // agent-name becomes agentName
  .option('-d, --directory-facilitator <df>', 'Agent name of the Directory Facilitator', /^(\w*)$/i, 'DF')
  .parse(process.argv);

var agentOptions = {
  id: program.agentName,
  DF: program.directoryFacilitator,
  initial: {
    fillerLevel: program.fillerLevel
  }
};

eve.system.init({
  transports: [
    {
      type: 'amqp',
      url: 'amqp://localhost'
    }
  ]
});

// create two agents
var BottleInstance = new BottleAgent(agentOptions);

Promise.all([BottleInstance.ready]).then(function () {
  // Register skill


  BottleInstance.rpc.request(agentOptions.DF,{method: 'getAgentsForSkill', params: {skill: 'fill'}})
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
