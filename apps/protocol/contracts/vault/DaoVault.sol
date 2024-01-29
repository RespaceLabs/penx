// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract DaoVault {
  receive() external payable {}

  fallback() external payable {}

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }

  function transferETH(address payable recipient, uint amount) external {
    recipient.transfer(amount);
  }
}
