//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    bool private gm;

    constructor() {
        gm = true;
        console.log("Deploying a Greeter with gm:", gm);
    }

    function isGm() public view returns (bool) {
        console.log("gm: ", gm);
        return gm;
    }

    function toggleGm() public {
        console.log("Changing greeting from '%s' to '%s'", gm, !gm);
        gm = !gm;
    }
}
