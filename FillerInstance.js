var Promise = require('bluebird');
var eve = require('evejs');
var FillerAgent = require('./agents/FillerAgent');

eve.system.init({
  transports: [
    {
      type: 'amqp',
      url: 'amqp://localhost'
    }
  ]
});

// create one agents
var FillerInstance = new FillerAgent('Filler1', 200);

Promise.all([FillerInstance.ready]).then(function () {
  // Register skills
  FillerInstance.rpc.request('DF',{method: 'register', params: {skill: 'fill'}})
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
  FillerInstance.rpc.request('DF', { method: 'deRegisterAll' } )
    .then(function(reply){
      console.log('deRegisterall successfull. exiting...');
    })
    .catch(function(err){
      console.log('deRegisterAll not successfull. exiting ...');
    });
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('uncaughtException', exitHandler);