var Promise = require('bluebird');
var _ = require('underscore');
var eve = require('evejs');

function DFAgent(id) {
  // execute super constructor
  eve.Agent.call(this, id);

  this._skills = [];
  this._agents = [];

  // load the RPC module
  this.rpc = this.loadModule('rpc', this.rpcFunctions, {timeout:2*1000});

  // connect to all transports provided by the system
  this.connect(eve.system.transports.getAll());
}

// extend the eve.Agent prototype
DFAgent.prototype = Object.create(eve.Agent.prototype);
DFAgent.prototype.constructor = DFAgent;

// create an object containing all RPC functions.
DFAgent.prototype.rpcFunctions = {};
DFAgent.prototype.rpcFunctions.register = function(params, from){
  console.log('Agent', from, 'wants to register itself');
  if(_.findWhere(this._agents, {agent: from})){
    var err = from + 'has already registered';
    console.log(err);
    return {err: err};
  }
  else {
    this._agents.push({agent: from});
    return {status: 'ok', description: 'agent has been registered'};
  }
};
DFAgent.prototype.rpcFunctions.registerSkill = function(params, from) {
  console.log('Agent', from, 'wants to register', params);

  // only push if skill and agent have not yet been registered
  var agentList = _.findWhere(this._skills, {skill: params.skill}); // see if from is in this list
  if(_.findWhere(agentList, {agent: from})){
    var err = 'agent ' + from + ' has already registered with this skill:' + params.skill;
    console.log(err);
    return {err: err};
  }
  else {
    this._skills.push({skill: params.skill, agent: from});
    console.log('current skill list:', this._skills)

    return {status: 'ok'};
  }
};
/**
 * @param params (not used)
 * @param from
 * @returns {{status: string}}
 */
DFAgent.prototype.rpcFunctions.deRegisterAll = function(params, from){
  // Generate new skill array without the skills from the caller agent (*from)
  this._skills = _.reject(this._skills, function(skill){
    return (skill.agent == from);
  });
  return {status: 'ok'};
};
/**
 * @param params {skill: 'skill'}
 * @param from
 * @returns {{status: string}}
 */
DFAgent.prototype.rpcFunctions.deRegister = function(params, from){
  // Generate new skill array without the skill to deregister from the caller agent (*from)
  this._skills = _.reject(this._skills, function(skill){
    return ( (skill.agent == from) && (skill.skill == params.skill));
  });
  return {status: 'ok'};
};
/**
 * @param params {skill: 'skill'}
 * @param from
 */
DFAgent.prototype.rpcFunctions.getAgentsForSkill = function(params, from) {
  console.log('Agent', from, 'wants to get all agents for',params);

  // returns all skill-agent with the required skill
  return _.filter(this._skills, function(entry){
    return entry.skill == params.skill;
  });
};

module.exports = DFAgent;