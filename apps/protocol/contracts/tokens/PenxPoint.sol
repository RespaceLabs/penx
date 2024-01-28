// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PenxPoint is ERC20, Ownable {
  constructor() ERC20("PenX point Token", "PXP") {}

  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
    require(from == address(0), "Token transfer is blocked");
    super._beforeTokenTransfer(from, to, amount);
  }
}
