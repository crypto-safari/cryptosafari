pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract token is ERC721Full, ERC721MetadataMintable, Ownable {

  //id: 0~15 100115
  uint[256] private count;

  constructor(string memory _name, string memory _symbol) public ERC721Full(_name, _symbol) {}

  function createChar(address _to, uint256 _tokenId, string memory _tokenURI) public {

    uint256 _id = 100000 + _tokenId + count[_tokenId] * 100;
    count[_tokenId]++;

    _mint(_to, _id);
    _setTokenURI(_id, _tokenURI);
  }

}