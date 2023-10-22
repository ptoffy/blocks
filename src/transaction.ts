import { SHA256 } from "crypto-js";
import { ec } from "elliptic";
const elliptic = new ec('secp256k1');

export class Transaction {
    // This identifies the transaction in the blockchain
    public signature: string | null = null;
    constructor(
        public fromAddress: string | null,
        public toAddress: string,
        public amount: number
    ) { }

    /**
     * Calculate the hash of the transaction.
     */
    public calculateHash(): string {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    /**
     * Sign a transaction with a private key.
     * By signing a transaction, we prevent anyone else from spending a users funds.
     * 
     * @param {PrivateKey} privateKey 
     */
    public signTransaction(privateKey: ec.KeyPair): void {
        if (privateKey.getPublic('hex') !== this.fromAddress)
            throw new Error('You cannot sign transactions for other wallets!');

        const hash = this.calculateHash();
        const signature = privateKey.sign(hash, 'base64');
        this.signature = signature.toDER('hex');
    }

    /**
     * Check if the transaction is valid.
     * 
     * @returns {boolean}
     */
    public isValid(): boolean {
        // If the transaction is a mining reward, it is valid
        if (this.fromAddress === null) return true;

        // If the transaction is not signed, it is invalid
        if (this.signature === null || this.signature.length === 0)
            throw new Error('No signature in this transaction');

        // Check if the transaction is signed with the correct key
        const publicKey = elliptic.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
