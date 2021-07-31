import { Component , useState, useEffect} from 'react';

import * as fs from 'fs';
const { initialize } = require('zokrates-js');
let compiler, compute, zkProvider, proofer, verifier, hashArtifacts;


 const iniZokrates = () => {
  initialize().then((zk) => {
    zkProvider = zk;
    compiler = zk.compile;
    compute = zk.computeWitness;
    proofer = zk.generateProof;
    verifier = zk.verify;
  });
}
 export {iniZokrates, compiler, compute, zkProvider, proofer, verifier, hashArtifacts}//{ setupProvider, zkProvider, voteKeyGenerator, membershipTest}