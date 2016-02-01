var Promise = require('bluebird');
var readline = require('readline'); // handle live input
var program = require('commander'); // handle cli options

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

program
  .version('0.0.1')
  .option('-a, --agent-name', 'Agent name') // agent-name becomes agentName
  .parse(process.argv);

if(typeof program.agentName == 'undefined') {
  program.agentName = 'DF';
}

// Agent config
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
var DF = new DFAgent(program.agentName);

Promise.all([DF.ready]).then(function () {
  console.log('agent ', program.agentName, ' ready');
});

function input(){
  rl.question("\n>>", function(answer){
    if(answer == 'exit') {
      console.log('program exiting');
      process.exit(0);
    }
    else {
      console.log('you said:',answer);
      input();
    }
  });
}
input();