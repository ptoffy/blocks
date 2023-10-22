import { Chain } from "./chain";
import { Transaction } from "./transaction";

const chain = new Chain();

// Create some transactions

// Normally, "address1" and "address2" are wallet addresses, or rather public keys
chain.addTransaction(new Transaction('address1', 'address2', 100));
chain.addTransaction(new Transaction('address2', 'address1', 50));

// Mine block
chain.minePendingTransactions('address3');

// This is going to be 0, since the pending transactions are not added to the blockchain yet
// and the mining reward is not yet sent to the miner. 
// For "address3" to have a balance, we need to mine another block
console.log('Balance of address3 is ', chain.getBalanceOfAddress('address3')); // 0

// Mine another block to add the pending transactions to the blockchain
// and send the mining reward to the miner
chain.minePendingTransactions('address3');

console.log('Balance of address3 is ', chain.getBalanceOfAddress('address3')); // 100
