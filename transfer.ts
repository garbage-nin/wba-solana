import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";

import wallet from "./wba-wallet.json";
import bs58 from "bs58";

//const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const arraySecretKey = bs58.decode(wallet.secretKey as string);

const keypair = Keypair.fromSecretKey(new Uint8Array(arraySecretKey));

const to = new PublicKey("GLtaTaYiTQrgz411iPJD79rsoee59HhEy18rtRdrhEUJ");

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(keypair.publicKey);
    console.log("Balance before transfer:", balance);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: to,
        lamports: LAMPORTS_PER_SOL / 100,
      })
    );

    transaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;

    transaction.feePayer = keypair.publicKey;

    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;

    console.log("Fee of transaction:", fee);
    transaction.instructions.pop();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log(
      `Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.log(e);
  }
})();
