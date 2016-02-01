var Promise = require('bluebird');
var program = require('commander');
var eve = require('evejs');
var FillerAgent = require('./agents/FillerAgent');

program
  .version('0.0.2')
  .option('-a, --agent-name <name>', 'Agent name: e.g. FillerAgent7', /^(\w*)$/i, 'FillerAgent1') // agent-name becomes agentName
  .option('-l, --filler-level <n>', 'Filler Level at start', parseFloat, 100)
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

// create one agents
var FillerInstance = new FillerAgent(agentOptions);

Promise.all([FillerInstance.ready]).then(function () {
  // Register skills
  FillerInstance.rpc.request(agentOptions.DF,{method: 'registerSkill', params: {skill: 'fill'}})
    .then(function(reply){
      if(reply.err){
        console.log('skill "fill" could not be registered');
      }
      console.log(reply);
    })
    .catch(function(err){
      console.log('catchedErr',err);
    });
});


// Clean up
function exitHandler(){
  FillerInstance.rpc.request(agentOptions.DF, { method: 'deRegisterAll' } )
    .then(function(reply){
      console.log('deRegisterall successfull. exiting...');
      process.exit();
    })
    .catch(function(err){
      console.log('deRegisterAll not successfull. exiting ...');
      process.exit();
    });
}

process.on('SIGINT', exitHandler);
process.on('uncaughtException', exitHandler);