// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IVault.sol";
import "../tokens/INK.sol";
import "../storage/RoleAccessControl.sol";

contract BountyFacet {
  using SafeERC20 for IERC20;

  INK private immutable ink;

  event ClaimRewardCreated(string bountyId, address to);
  event ClaimRewardFilled(string bountyId);

  struct RewardParam {
    address token;
    uint256 amount;
  }

  constructor(INK _ink) {
    ink = _ink;
  }

  receive() external payable {}

  fallback() external payable {}

  function createClaimReward(string memory bountyId) external payable {
    // console.log("===========bountyId:", bountyId, msg.sender);
    emit ClaimRewardCreated(bountyId, msg.sender);
  }

  function executeClaimReward(string memory bountyId, address payable to, RewardParam[] calldata rewards) external {
    RoleAccessControl.checkRole(RoleAccessControl.ROLE_KEEPER);

    for (uint256 i; i < rewards.length; i++) {
      RewardParam memory reward = rewards[i];

      // console.log(
      //   "===========reward:",
      //   reward.token,
      //   reward.amount,
      //   ink.balanceOf(IVault(address(this)).getDaoVaultAddress())
      // );

      IVault(address(this)).getDaoVault().transferToken(reward.token, to, reward.amount);
    }

    emit ClaimRewardFilled(bountyId);
  }
}
