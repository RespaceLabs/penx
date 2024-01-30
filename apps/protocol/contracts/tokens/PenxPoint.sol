// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PenxPoint is ERC20, Ownable {
  constructor() ERC20("PenX point Token", "PXP") {
    uint256 initialSupply = 10_000 * 10 ** decimals();
    _mint(msg.sender, initialSupply);
  }

  receive() external payable {}

  fallback() external payable {}

  // function mint(address to, uint256 amount) external onlyOwner {
  function mint(address to, uint256 amount) external {
    console.log("===============to:", to, "amount:", amount);
    _mint(to, amount);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
    require(from == address(0), "Token transfer is blocked");
    super._beforeTokenTransfer(from, to, amount);
  }
}
