pragma solidity ^0.4.15;

/*

  https://galleass.io
  by Austin Thomas Griffith

  The Experience contract tracks milestone accomplishments for each player.
  For instance, if they have never purchased a Dogger, (milestone 1), then
  the UI should show a big obvious button to buy a Dogger. As milestones are
  reached new items become available.

*/

// (Harbor.sol)       milestone 1: buy ship
// (Sea.sol)          milestone 2: Catch a fish
// (Fishmonger.sol)   milestone 3: Sell Fish for Copper

import 'Galleasset.sol';
import 'zeppelin-solidity/contracts/ownership/HasNoEther.sol';

contract Experience is Galleasset, HasNoEther {

  function Experience(address _galleass) public Galleasset(_galleass) { }

  mapping(address => mapping(uint16 => bool)) public experience;

  function update(address _player,uint16 _milestone,bool _value) public isGalleasset("Experience") returns (bool) {
    require(hasPermission(msg.sender,"updateExperience"));
    experience[_player][_milestone]=_value;
    ExperienceUpdate(_player,_milestone,experience[_player][_milestone]);
    return true;
  }
  event ExperienceUpdate(address _owner,uint16 _milestone,bool _value);

  /*
  for some reason the automatic getter wasn't working until I made this one and now it's fine?!?
  function hasExperience(address _player,uint16 _milestone) public constant returns (bool){
    return experience[_player][_milestone];
  }*/
}
