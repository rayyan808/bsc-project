// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MerkleProof {
    /* Given a list of hashes, the root of the merkle, the hash of the private key 
    and index of the private key within the merkle tree */
    function verify(
        bytes32[] memory listOfHashes, bytes32 root, bytes32 leaf, uint index
    )
        public pure returns (bool)
    {
        bytes32 hash = leaf;

        for (uint i = 0; i < listOfHashes.length; i++) {
            bytes32 proofElement = listOfHashes[i];
            /*An even index means the current hash is the left node*/
            if (index % 2 == 0) {
                hash = keccak256(abi.encodePacked(hash, proofElement));
            } else {
            /* An odd index means the current hash is the left node*/
                hash = keccak256(abi.encodePacked(proofElement, hash));
            }
            /* Each layer of the tree is a power of 2, so we drop a power */
            index = index / 2;
        }

        return hash == root;
    }
}
/* */
contract TestMerkleProof is MerkleProof {
    bytes32[] public hashes;

    constructor() {
        string[4] memory transactions = [
            "alice -> bob",
            "bob -> dave",
            "carol -> alice",
            "dave -> bob"
        ];

        for (uint i = 0; i < transactions.length; i++) {
            hashes.push(keccak256(abi.encodePacked(transactions[i])));
        }

        uint n = transactions.length;
        uint offset = 0;

        while (n > 0) {
            /* For each Transaction,*/
            for (uint i = 0; i < n - 1; i+=2) {
                hashes.push(
                    keccak256(abi.encodePacked(
                        hashes[offset + i],
                        hashes[offset + i + 1]
                    ))
                );
            }
            offset += n;
            n = n / 2;
        }
    }

    function getRoot() public view returns (bytes32) {
        return hashes[hashes.length - 1];
    }

    /* verify
    3rd leaf
    0x1bbd78ae6188015c4a6772eb1526292b5985fc3272ead4c65002240fb9ae5d13

    root
    0x074b43252ffb4a469154df5fb7fe4ecce30953ba8b7095fe1e006185f017ad10

    index
    2

    proof
    0x948f90037b4ea787c14540d9feb1034d4a5bc251b9b5f8e57d81e4b470027af8
    0x63ac1b92046d474f84be3aa0ee04ffe5600862228c81803cce07ac40484aee43
    */
}

