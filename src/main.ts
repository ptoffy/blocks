import { Chain } from "./chain";

const chain = new Chain();
console.log(chain.isValid()); // true

chain.addBlock("First Block");
chain.addBlock("Second Block");
chain.addBlock("Third Block");

console.log(chain.isValid()); // true

chain.blocks[1].data = "Corrupted Data";
console.log(chain.isValid()); // false

chain.blocks[1].hash = chain.blocks[1].calculateHash();
console.log(chain.isValid()); // false

chain.blocks[1].previousBlockHash = chain.blocks[0].hash;
console.log(chain.isValid()); // true

chain.blocks[1].hash = chain.blocks[1].calculateHash();
console.log(chain.isValid()); // true
