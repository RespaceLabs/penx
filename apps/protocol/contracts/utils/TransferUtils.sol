// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../utils/Errors.sol";

library TransferUtils {
  uint256 private constant _TRANSFER_GAS_LIMIT = 100000;

  function transfer(address token, address receiver, uint256 amount) external {
    if (amount == 0) {
      return;
    }

    (bool success, ) = nonRevertingTransferWithGasLimit(IERC20(token), receiver, amount, _TRANSFER_GAS_LIMIT);

    if (success) {
      return;
    }

    revert Errors.TokenTransferError(token, receiver, amount);
  }

  function nonRevertingTransferWithGasLimit(
    IERC20 token,
    address to,
    uint256 amount,
    uint256 gasLimit
  ) internal returns (bool, bytes memory) {
    bytes memory data = abi.encodeWithSelector(token.transfer.selector, to, amount);
    (bool success, bytes memory returndata) = address(token).call{ gas: gasLimit }(data);

    if (success) {
      // some tokens do not revert on a failed transfer, they will return a boolean instead
      // validate that the returned boolean is true, otherwise indicate that the token transfer failed
      if (returndata.length > 0 && !abi.decode(returndata, (bool))) {
        return (false, returndata);
      }

      // transfers on some tokens do not return a boolean value, they will just revert if a transfer fails
      // for these tokens, if success is true then the transfer should have completed
      return (true, returndata);
    }

    return (false, returndata);
  }
}
