
const SHA256 = require('crypto-js/SHA256');

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.index = -1;

        /**
         * Random value property that we have to guess so our mining requirement (X zeros) in front will be met
         */
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineblock(difficulty) {
        let start = new Date().getTime();
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ', this.hash, `${new Date().getTime()-start}ms`);
    }

}

class BlockChain {
    constructor() {
        this.chain = [this.genesis()];
        this.difficulty = 2;
    }

    genesis() {
        let adam = new Block('01/01/2018', 'Genesis Block', '0');
        adam.index = 0;
        return adam;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.index = this.chain.length;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineblock(this.difficulty);
       
        this.chain.push(newBlock);
    }

    /**
     * @returns {boolean}
     */
    isChainValid() {
        for (let index = 1; index < this.chain.length; index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.previousHash !== previousBlock.hash) return false;


        }

        return true;
    }

}


let sampleChain = new BlockChain();

sampleChain.addBlock(new Block(new Date(), { message: 'My first attempt at Blockchain implementation.' }));
sampleChain.addBlock(new Block(new Date(), { message: 'New Message' }));
sampleChain.addBlock(new Block(new Date(), { amount: 4 }));


