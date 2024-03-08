// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";

library CalUtils {
  using SafeCast for uint256;
  using SafeCast for int256;
  using SignedMath for int256;

  uint256 public constant RATE_PRECISION = 100000;

  function mulRate(uint256 value, uint256 rate) external pure returns (uint256) {
    return Math.mulDiv(value, rate, RATE_PRECISION);
  }

  function divRate(uint256 value, uint256 rate) external pure returns (uint256) {
    return Math.mulDiv(value, RATE_PRECISION, rate);
  }
}
