// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../utils/TransferUtils.sol";
import "../utils/RoleKeys.sol";
import "../utils/Errors.sol";
import "../storage/RoleAccessControl.sol";

contract DaoVault {
  using SafeERC20 for IERC20;

  address public owner;

  constructor() {
    owner = msg.sender;
  }

  receive() external payable {}

  fallback() external payable {}

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }

  function transferETH(address payable recipient, uint amount) external {
    recipient.transfer(amount);
    // (bool success, ) = recipient.call{ value: amount }(new bytes(0));
    // require(success, "SET");
  }

  mapping(address => uint256) public tokenBalances;

  function transferToken(address token, address receiver, uint256 amount) external {
    console.log("token==========:", token, "receiver:", receiver);
    require(IERC20(token).transfer(receiver, amount), "transfer failed");
  }

  function transferOut(address token, address receiver, uint256 amount) external {
    if (receiver == address(this)) {
      revert Errors.AddressSelfNotSupported(receiver);
    }

    // console.log("transfer=========msg.sender:", msg.sender);
    require(msg.sender == owner, "Only owner can transfer");

    TransferUtils.transfer(token, receiver, amount);
    tokenBalances[token] = IERC20(token).balanceOf(address(this));
  }

  function getTransferInAmount(address token) external returns (uint256) {
    uint256 prevBalance = tokenBalances[token];
    uint256 nextBalance = IERC20(token).balanceOf(address(this));
    tokenBalances[token] = nextBalance;
    return nextBalance - prevBalance;
  }
}
