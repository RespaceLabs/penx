// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../utils/RoleKeys.sol";
import "../utils/Errors.sol";
import "../storage/RoleAccessControl.sol";

contract DaoVault is AccessControl {
  using SafeERC20 for IERC20;

  bytes32 public constant ADMIN_ROLE = "ADMIN_ROLE";
  bytes32 public constant KEEPER_ROLE = "KEEPER_ROLE";

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
  }

  receive() external payable {}

  fallback() external payable {}

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }

  function transferETH(address payable recipient, uint amount) external onlyRole(ADMIN_ROLE) {
    recipient.transfer(amount);
  }

  function transferERC20Token(address token, address receiver, uint256 amount) external onlyRole(KEEPER_ROLE) {
    require(IERC20(token).transfer(receiver, amount), "transfer failed");
  }
}
