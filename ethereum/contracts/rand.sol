pragma solidity ^0.5.0;

contract rand {
  uint256 private seed;


  constructor() public {
    seed = getRand();
  }

  function getRand() public view returns(uint256) {
    uint256 randNumber = uint256(keccak256(abi.encodePacked(
      seed,
      now,
      block.number,
      msg.sender
    )));
    return randNumber;
  }

  function update() public returns(uint256) {
    uint256 randNumber = getRand();
    seed = randNumber;
    return randNumber;
  }

  function easyRand() view public returns(uint256) {
    return uint256(keccak256(abi.encodePacked(seed)));
  }
}
