// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract INK is ERC20, ERC20Permit, Ownable {
  uint256 private constant _initialSupply = 1_000_000_000 * 10 ** 18;
  uint256 private constant _maxSupply = 10_000_000_000 * 10 ** 18;

  constructor(address initialOwner) ERC20("Ink Token", "INK") Ownable(initialOwner) ERC20Permit("Ink Token") {
    _mint(initialOwner, _initialSupply);
  }

  receive() external payable {}

  fallback() external payable {}

  function mint(address to, uint256 amount) public onlyOwner {
    require(totalSupply() + amount <= _maxSupply, "Exceeds max supply");
    _mint(to, amount);
  }

  function burn(address account, uint256 amount) public onlyOwner {
    _burn(account, amount);
  }
}
