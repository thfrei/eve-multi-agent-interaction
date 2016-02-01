var Promise = require('bluebird');
var readline = require('readline'); // handle live input
var program = require('commander'); // handle cli options

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

program
  .version('0.0.1')
  //.option('-a, --agent-name', 'Agent name') // agent-name becomes agentName
  .parse(process.argv);

//if(typeof program.agentName == 'undefined') {
//  program.agentName = 'DF';
//}

function cli(){
  rl.question(">>", function(answer){
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
cli();