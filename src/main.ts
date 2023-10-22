import { Chain } from "./chain";
import { Transaction } from "./transaction";
import { ECDSA } from "./ecdsa";

const ecdsa = ECDSA.getInstance();
const ec = ecdsa.getEC();
const keyPair = ec.genKeyPair();
const walletAddress = keyPair.getPublic('hex');

const chain = new Chain();

// Create a transaction
const transaction = new Transaction(walletAddress, 'receiver-public-key', 10);
// Sign the transaction
transaction.signTransaction(keyPair);

// Add the transaction to the chain
chain.addTransaction(transaction);

// Mine a block
chain.minePendingTransactions(walletAddress);

// Check if the chain is valid
console.log('Is chain valid?', chain.isValid());

// This is going to be -10 because we sent 10 coins to the receiver but 
// we haven't received any coins from the mining yet 
console.log('Balance of wallet is', chain.getBalanceOfAddress(walletAddress)); // -10

// Let's try to tamper with the chain
chain.blocks[1].transactions[0].amount = 1000;

// Check if the chain is still valid
console.log('Is chain valid?', chain.isValid()); 
