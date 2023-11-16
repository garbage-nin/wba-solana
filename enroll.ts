import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
} from "@project-serum/anchor";
import { WbaPrereq, IDL } from "./programs/wba_prereq";
import wallet from "./wba-wallet.json";
import bs58 from "bs58";

// convert first wallet secretkey to base58
const arraySecretKey = bs58.decode(wallet.secretKey as string);

const keypair = Keypair.fromSecretKey(new Uint8Array(arraySecretKey));

const connection = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("garbage-nin", "utf8");
const wbaIDL = "HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1";

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program = new Program<WbaPrereq>(IDL, wbaIDL as Address, provider);

// create the pda for our enrollment account
const enrollmentSeeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollmentKey, _bump] = PublicKey.findProgramAddressSync(
  enrollmentSeeds,
  program.programId
);

// Execute our enrollment transaction
(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
        prereq: enrollmentKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log(
      `success! check out your tx here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
  } catch (e) {
    console.log(e);
  }
})();
