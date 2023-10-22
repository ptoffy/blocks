import { Block } from "./block";
import { Transaction } from "./transaction";

export class Chain {
    blocks: Block[];
    pendingTransactions: Transaction[];
    // The reward a miner gets for mining a block.
    miningReward: number;
    difficulty: number;

    constructor() {
        this.blocks = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.miningReward = 100;
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block([], '0');
    }

    getLatestBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    /**
     * Since we only create blocks on a specific interval (e.g. every 10 minutes),
     * we need a place to store transactions that are made in the meantime.
     * Those pending transactions are stored in an array and will be added to the next block.
     * @param miningRewardAddress The wallet address to send the mining reward to, after mining a block.
     */
    minePendingTransactions(miningRewardAddress: string) {
        // Normally, adding all pending transaction is not how a blockchain works, 
        // since it would be way too much data to store, 
        // instead the miners can pick which transactions they want to include in the next block
        const block = new Block(this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        this.blocks.push(block);
        // After mining a block, we reset the pending transactions and send the mining reward
        this.pendingTransactions = [
            // Here we set the 'fromAddress' to null, since the reward for mining a block is not a transaction that comes from any wallet.
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    /**
     * Adds a new transaction to the list of pending transactions (to be added to the next block).
     * @param transaction The transaction to add.
     */
    addTransaction(transaction: Transaction) {
        this.pendingTransactions.push(transaction);
    }

    /**
     * Returns the balance of a wallet address.
     * Since there is no 'balance' property on a wallet,
     * we need to loop over all transactions on all blocks to calculate the balance.
     * @param address The wallet address to get the balance of.
     * @returns The balance of the wallet address.
     */
    getBalanceOfAddress(address: string): number {
        let balance = 0;
        for (const block of this.blocks) {
            for (const transaction of block.transactions) {
                // If the given address is the sender, then reduce the balance
                if (transaction.fromAddress === address)
                    balance -= transaction.amount;
                // If the given address is the receiver, then increase the balance
                if (transaction.toAddress === address)
                    balance += transaction.amount;
            }
        }
        return balance;
    }

    /**
     * Checks if the chain is valid.
     * For the chain to be valid, the hash of each block must be valid 
     * and the previousBlockHash of each block must match the hash of the previous block.
     * @returns true if the chain is valid, false otherwise.
     */
    isValid(): boolean {
        for (let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousBlockHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}
