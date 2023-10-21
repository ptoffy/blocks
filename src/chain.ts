import { Block } from "./block";

export class Chain {
    blocks: Block[];

    constructor() {
        this.blocks = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block("Genesis Block")
    }

    getLatestBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    addBlock(data: any) {
        const block = new Block(data, new Date(), this.getLatestBlock().hash);
        this.blocks.push(block);
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
