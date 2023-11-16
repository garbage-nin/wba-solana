import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./wba-wallet.json";
import bs58 from "bs58";
//const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// convert first wallet secretkey to base58
const arraySecretKey = bs58.decode(wallet.secretKey as string);

const keypair = Keypair.fromSecretKey(new Uint8Array(arraySecretKey));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      LAMPORTS_PER_SOL
    );
    console.log(
      `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
  } catch (e) {
    console.log(e);
  }
})();
