pragma solidity ^0.8.4;
import {Constants} from "./constants.sol";
contract MiMC {
  uint constant FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

  function MiMCFeistel(uint256 xL_in, uint256 xR_in) public pure returns (uint256[4] memory){
    	
    uint[220] memory IV = Constants.getConstants();

	uint256 t = 0;
	uint nRounds = 220;
  uint k = 220;
	uint256[220] memory exp; //length: nRounds
	uint256[220] memory t4;
	uint256[220] memory xL; 
	uint256[220] memory xR; 
	uint256 c = 0;
  for(uint i = 0; i <= nRounds; i++){
		uint index;
		if(i == 0){
			index = 0;
		} else {
			index = i - 1; 
		}

		c = IV[i];
		if(i == 0){
			t = k + xL_in;
		} else {
			t = k + xL[index] + c; 
		}
		exp[i] = t * t;
		t4[i] = exp[i] * exp[i];
    if(i < nRounds - 1){
      if(i == 0){
          xL[i] = xR_in + t4[i]* t;
      } else {
          xL[i] = xR[index] + t4[i] * t;
      }
    } 
    else {
      xL[i] = xL[index];
    }
    if(i < nRounds - 1){
      if(i == 0){
        xR[i] = xL_in;
      } else {
        xR[i] = xL[index];
      }
    } else {
      xR[i] = xR[index] + t4[i]*t;
    }
  }	
  return [xL[nRounds - 1], xR[nRounds - 1], 0, 0];
//	return (xL[nRounds - 1], xR[nRounds - 1]);
  }
  /* Returns a BigNumber (BN) type for Truffle and Web3. The test should convert it to integer form somehow
  (Summation over array?) 
  INPUT: 1337, 0
  OUTPUT: 
  function hashMiMC(uint256 _left, uint256 _right) public pure returns (uint256) {
    uint256 R = _left;
    uint256 C = 0;
    (R, C) = mimcSponge(R, C);
    R = addmod(R, uint256(_right), FIELD_SIZE);
    (R, C) = mimcSponge(R, C);
    return R;
  }*/
  function mimcSponge(uint256 alpha, uint256 beta) public returns(uint256) {
	uint256[2] memory ins = [alpha, beta];
	uint nInputs = 2;

	uint256[4][2] memory S; // Dim: (nInputs + nOutputs - 1, 2)
	//field[3] outs = [0; 3]
    uint256 outs = 0;
    for(uint i =0; i < nInputs; i++){
		uint index;
		if(i == 0){
			index = 0;
		} else {
			index = i - 1; 
		}
    if(i ==0) { 
      uint256[4] memory x = MiMCFeistel(ins[0], 0); 
      S[i][0] = x[0];
      S[i][1] = x[1];
      } else { 
      S[i] = MiMCFeistel(S[index][0] + ins[i], S[index][1]);
     }
	}
	outs = S[nInputs - 1][0];
	//outs[0] = S[nInputs - 1][0]
    /*
	for field i in 0..(nOutputs - 1) do
		field[2] feistelRes = MiMCFeistel(S[nInputs + i - 1][0], S[nInputs + i - 1][1], k)
		S[nInputs + i] = feistelRes
		outs[i + 1] = S[nInputs + i][0]
	endfor */

	return outs;
}
}