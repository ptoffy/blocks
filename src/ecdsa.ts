import * as elliptic from 'elliptic';

/**
 * Singleton class to provide ECDSA functionalities
 */
export class ECDSA {
    private static instance: ECDSA | null = null;

    private ec: elliptic.ec;

    private constructor() {
        this.ec = new elliptic.ec('secp256k1');
    }

    /**
     * Get the singleton instance of ECDSA
     * @returns {ECDSA}
     */
    public static getInstance(): ECDSA {
        if (!ECDSA.instance)
            ECDSA.instance = new ECDSA();

        return ECDSA.instance;
    }

    public getEC(): elliptic.ec {
        return this.ec;
    }
}
