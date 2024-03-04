// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PasswordManager {
  mapping(address => string) private passwords;

  function setPassword(string memory message) external {
    passwords[msg.sender] = message;
  }

  function getPassword() external view returns (string memory) {
    return passwords[msg.sender];
  }
}
