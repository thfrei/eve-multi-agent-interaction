var Promise = require('bluebird');
var _ = require('underscore');
var eve = require('evejs');

function DFAgent(id) {
  // execute super constructor
  eve.Agent.call(this, id);

  this.skills = [];

  // load the RPC module
  this.rpc = this.loadModule('rpc', this.rpcFunctions, {timeout:10*1000});

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
DFAgent.prototype = Object.create(eve.Agent.prototype);
DFAgent.prototype.constructor = RPCAgent;

// create an object containing all RPC functions.
DFAgent.prototype.rpcFunctions = {};
// create an RPC function
DFAgent.prototype.rpcFunctions.register = function(params, from) {
  console.log('Agent', from, 'wants to register');

  this.skills.push({skill: params.skill, agent: from});

  return {status: 'ok'};
};
DFAgent.prototype.rpcFunctions.getAgents = function(params, from) {
  console.log('Agent', from, 'wants to get all available skills');

  return _.findWhere(this.skills, {skill: params.skill});
};


module.exports = RPCAgent;