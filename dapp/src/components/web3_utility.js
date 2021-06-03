import Web3 from 'web3';
import { ElectionAbi, ELECTION_ADDRESS } from '../assets/contracts/ElectionAbi.js';

let web3 = new Web3(/*Web3.givenProvider ||*/ "ws://localhost:7545");
let Election = new web3.eth.Contract(ElectionAbi,ELECTION_ADDRESS);
/*
async function iniDApp() 
{
  try {
   web3 = new Web3(/*Web3.givenProvider || "ws://localhost:7545");
  } catch(err){
    console.log("Error initializing Web3");
  }
  try {
    Accounts = await web3.eth.getAccounts();
   } catch(err){
     console.log("Error initializing Accounts");
   }
   try {
     console.log(ElectionAbi);
    Election = new web3.eth.Contract(Abi,ELECTION_ADDRESS);
    console.log(Election.methods);
   // Election = await eContract.at(ELECTION_ADDRESS/*  , 'hex address of contract');
   } catch(err){
     console.log("Error initializing Election Contract :" + err);
   }
  //iniZokrates();
}  */
export {Election, web3};