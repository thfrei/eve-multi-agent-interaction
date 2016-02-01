var Promise = require('bluebird');
var readline = require('readline'); // handle live input
var program = require('commander'); // handle cli options
var exec = require('child_process').exec;

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
    if( comparePrefix(answer, 'exit') ) {
      console.log('program exiting');
      process.exit(0);
    }
    else if( comparePrefix(answer, 'spawn') ){
      var cliArray = answer.split(" ");
      console.log('spawning an',cliArray[1]);
    }
    else {
      console.log('you said:',answer);
      console.log('this command is not supported. Try something like: spawn BottleAgent MyBottleAgent2 ')
    }
    cli();
  });
}
cli();

function comparePrefix(variable,prefix){
  return variable.substr(0,prefix.length) == prefix;
}