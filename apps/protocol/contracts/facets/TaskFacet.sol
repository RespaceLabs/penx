// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IVault.sol";
import "../tokens/PenxPoint.sol";

contract TaskFacet {
  PenxPoint private immutable point;

  event ClaimRewardCreated(string taskId);
  event ClaimRewardFilled(string taskId);

  constructor(PenxPoint _point) {
    point = _point;
  }

  receive() external payable {}

  fallback() external payable {}

  function createClaimReward(string memory taskId) external payable {
    emit ClaimRewardCreated(taskId);
  }

  function executeClaimReward(string memory taskId, address payable account, uint256 amount) external {
    // IVault(address(this)).getDaoVault().transferETH(account, amount);
    point.mint(account, amount);
    emit ClaimRewardFilled(taskId);
  }
}
