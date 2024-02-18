// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract INK is ERC20 {
  address public owner;

  constructor() ERC20("Ink Token", "INK") {
    uint256 initialSupply = 10_000_000_000 * 10 ** decimals();

    owner = msg.sender;

    _mint(owner, initialSupply);
  }

  receive() external payable {}

  fallback() external payable {}

  function mint(address to, uint256 amount) public {
    require(msg.sender == owner, "Only owner can mint tokens");

    _mint(to, amount);
  }
}
