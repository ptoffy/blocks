import { SHA256 } from 'crypto-js';
import { Transaction } from './transaction';

export class Block {
    hash: string;

    constructor(
        public transactions: Transaction[] = [],
        public previousBlockHash: string = '',
        public datetime: Date = new Date(),
        public nonce: number = 0
    ) {
        this.hash = this.calculateHash();
    }

    public calculateHash(): string {
        return SHA256(this.previousBlockHash + this.datetime + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /**
     * Since we don't want users to be able to spam blocks, we need to make it difficult to create a block.
     * We can do this by requiring the hash of a block to have a certain number of leading zeros.
     * This is called Proof of Work (PoW).
     * @param difficulty Number of leading zeros required in the hash. The higher the difficulty, the longer it takes to mine a block.
     */
    mineBlock(difficulty: number) {
        // Create a target hash with 'difficulty' number of leading zeros
        const targetHash = '0'.repeat(difficulty);

        // Continue searching for a valid nonce until the target hash condition is met
        while (this.hash.substring(0, difficulty) !== targetHash) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: ' + this.hash);
    }

    /**
     * Check if all transactions in the block are valid.
     * 
     * @returns {boolean}
     */
    public hasValidTransactions(): boolean {
        return this.transactions.every(transaction => transaction.isValid());
    }
}
