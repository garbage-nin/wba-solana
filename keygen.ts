import { Keypair } from "@solana/web3.js";

// generate Keypair
const keypair = Keypair.generate();

console.log("Public Key:", keypair.publicKey.toBase58());

console.log(keypair.secretKey);
