import * as anchor from "@coral-xyz/anchor";
import {BN, Program, web3} from "@coral-xyz/anchor";
import {randomBytes} from "crypto";
import {VestingToken2024} from "../target/types/vesting_token_2024";
import {Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    MINT_SIZE,
    TOKEN_2022_PROGRAM_ID,
    createAssociatedTokenAccountIdempotentInstruction,
    createInitializeMint2Instruction,
    createMintToInstruction,
    createTransferCheckedInstruction,
    getAssociatedTokenAddressSync,
    getMinimumBalanceForRentExemptMint
} from "@solana/spl-token";
import {assert} from "chai";
import {it} from "mocha";

describe("vesting_token_2024", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.VestingToken2024 as Program<VestingToken2024>;

    const provider = anchor.getProvider();

    const connection = provider.connection;
    const wait = (seconds: number) => {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    };
    const confirm = async (signature: string): Promise<string> => {
        const block = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature,
            ...block,
        });
        return signature;
    };

    const log = async (signature: string): Promise<string> => {
        console.log(
            `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
        );
        return signature;
    };

    const seed = new BN(randomBytes(8));
    const NOW = new BN(Math.floor(new Date().getTime() / 1000));
    // 1 yıl = 365 gün * 24 saat * 60 dakika * 60 saniye
    const ONE_YEAR = new BN(365 * 24 * 60 * 60);

// 7 yıl boyunca her yıl için zaman damgası oluşturuyoruz
    const LATER_1 = NOW.add(ONE_YEAR);
    const LATER_2 = LATER_1.add(ONE_YEAR);
    const LATER_3 = LATER_2.add(ONE_YEAR);
    const LATER_4 = LATER_3.add(ONE_YEAR);
    const LATER_5 = LATER_4.add(ONE_YEAR);
    const LATER_6 = LATER_5.add(ONE_YEAR);
    const LATER_7 = LATER_6.add(ONE_YEAR);
    const LATER = NOW.add(new BN(60));
    const EVEN_LATER = LATER.add(new BN(30));
    const EVEN_LATER_AGAIN = EVEN_LATER.add(new BN(30));
    const admin = Keypair.fromSecretKey(new Uint8Array('your secret key uint8array'));
    const vester = Keypair.fromSecretKey('your secret key uint8array'););
    const mint = new web3.PublicKey('your mint adress');
    const config = PublicKey.findProgramAddressSync(
        [
            Buffer.from("config"),
            admin.publicKey.toBuffer(),
            mint.toBytes(),
            seed.toBuffer("le", 8)
        ],
        program.programId
    )[0];

    const vault = getAssociatedTokenAddressSync(mint, config, true, TOKEN_2022_PROGRAM_ID);

    const vesterTa = getAssociatedTokenAddressSync(mint, vester.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const adminAta = getAssociatedTokenAddressSync(mint, admin.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const vestNow = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vest"),
            config.toBuffer(),
            vesterTa.toBuffer(),
            NOW.toBuffer("le", 8)
        ],
        program.programId
    )[0];

    const vestLater = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vest"),
            config.toBuffer(),
            vesterTa.toBuffer(),
            LATER.toBuffer('le', 8)
        ],
        program.programId
    )[0];

    const vestEvenLater = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vest"),
            config.toBuffer(),
            vesterTa.toBuffer(),
            EVEN_LATER.toBuffer('le', 8)
        ],
        program.programId
    )[0];

    const vestEvenLaterAgain = PublicKey.findProgramAddressSync(
        [
            Buffer.from("vest"),
            config.toBuffer(),
            vesterTa.toBuffer(),
            EVEN_LATER_AGAIN.toBuffer('le', 8)
        ],
        program.programId
    )[0];
    const vestLater1 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_1.toBuffer("le", 8)],
        program.programId
    )[0];

    const vestLater2 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_2.toBuffer("le", 8)],
        program.programId
    )[0];

    const vestLater3 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_3.toBuffer("le", 8)],
        program.programId
    )[0];

    const vestLater4 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_4.toBuffer("le", 8)],
        program.programId
    )[0];

    const vestLater5 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_5.toBuffer("le", 8)],
        program.programId
    )[0];

    const vestLater6 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_6.toBuffer("le", 8)],
        program.programId
    )[0];

    const vestLater7 = PublicKey.findProgramAddressSync(
        [Buffer.from("vest"), config.toBuffer(), vesterTa.toBuffer(), LATER_7.toBuffer("le", 8)],
        program.programId
    )[0];

    const accounts = {
        admin: admin.publicKey,
        payer: admin.publicKey,
        mint: mint,
        config,
        vault,
        vester: vester.publicKey,
        vesterTa,
        adminAta,
        recovery: adminAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId
    }

    /* it("Airdrop", async () => {
         let lamports = await getMinimumBalanceForRentExemptMint(connection);
         let tx = new Transaction();
         tx.instructions = [
             ...[admin, vester].map((k) =>
                 SystemProgram.transfer({
                     fromPubkey: provider.publicKey,
                     toPubkey: k.publicKey,
                     lamports: 10 * LAMPORTS_PER_SOL,
                 })
             ),
             SystemProgram.createAccount({
                 fromPubkey: provider.publicKey,
                 newAccountPubkey: mint.publicKey,
                 lamports,
                 space: MINT_SIZE,
                 programId: TOKEN_2022_PROGRAM_ID
             }),
             createInitializeMint2Instruction(
                 mint.publicKey,
                 6,
                 admin.publicKey,
                 undefined,
                 TOKEN_2022_PROGRAM_ID
             ),
             createAssociatedTokenAccountIdempotentInstruction(provider.publicKey, adminAta, admin.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID),
             createAssociatedTokenAccountIdempotentInstruction(provider.publicKey, vesterTa, vester.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID),
             createMintToInstruction(mint.publicKey, adminAta, admin.publicKey, 1e11, undefined, TOKEN_2022_PROGRAM_ID),
         ];
         await provider.sendAndConfirm(tx, [admin, mint]).then(log);
     });*/


    it("Initialize config", async () => {
        const tx = await program.methods
            .initialize(seed)
            .accounts({...accounts})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });

    it("Create a matured vest", async () => {
        const tx = await program.methods
            .createVesting(NOW, new BN(500e6))
            .accounts({...accounts, vest: vestNow})
            .signers([admin])
            .rpc({
                skipPreflight: true
            })
            .then(confirm)
            .then(log);
    });

    it("Create an unmatured vest", async () => {
        const tx = await program.methods
            .createVesting(LATER, new BN(500e6))
            .accounts({...accounts, vest: vestLater})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });

    it("Create another unmatured vest", async () => {
        const tx = await program.methods
            .createVesting(EVEN_LATER, new BN(500e6))
            .accounts({...accounts, vest: vestEvenLater})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late1 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER, new BN(500e6))
            .accounts({...accounts, vest: vestLater1})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late2 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER_2, new BN(500e6))
            .accounts({...accounts, vest: vestLater2})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late3 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER_3, new BN(500e6))
            .accounts({...accounts, vest: vestLater3})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late4 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER_4, new BN(500e6))
            .accounts({...accounts, vest: vestLater4})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late5 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER_5, new BN(500e6))
            .accounts({...accounts, vest: vestLater5})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late6 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER_6, new BN(500e6))
            .accounts({...accounts, vest: vestLater6})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("Create another late7 vest", async () => {
        const tx = await program.methods
            .createVesting(LATER_7, new BN(500e6))
            .accounts({...accounts, vest: vestLater7})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });

    it("Fail to claim a vest before finalization", async () => {
        try {
            const tx = await program.methods
                .claimVesting()
                .accounts({...accounts, vest: vestNow})
                .signers([vester])
                .rpc()
                .then(confirm)
                .then(log);
            throw new Error("Shouldn't have made it to here!")
        } catch (e) {
            assert((e as anchor.AnchorError).error?.errorCode?.code === "VestingUnfinalized")
        }
    });

    /*it("Cancel a vest", async () => {
         const tx = await program.methods
             .cancelVesting()
             .accounts({...accounts, vest: vestLater})
             .signers([admin])
             .rpc()
             .then(confirm)
             .then(log);
     });*/

    it("Finalizes the vest", async () => {
        const tx = await program.methods
            .finalize()
            .accounts({...accounts})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });

    it("Deposits vesting tokens", async () => {
        const tx = new Transaction();
        tx.add(createTransferCheckedInstruction(
            adminAta,
            mint,
            vault,
            admin.publicKey,
            1500e6,
            6,
            undefined,
            TOKEN_2022_PROGRAM_ID
        ))
        await provider.sendAndConfirm(tx, [admin]).then(log);
    });

    /*  it("Fail to cancel a vest after finalization", async () => {
          try {
              const tx = await program.methods
                  .cancelVesting()
                  .accounts({...accounts, vest: vestEvenLater})
                  .signers([admin])
                  .rpc()
                  .then(confirm)
                  .then(log);
          } catch (e) {
              assert((e as anchor.AnchorError).error?.errorCode?.code === "VestingFinalized")
          }
      });*/

    it("Fail to create a vest after finalize", async () => {
        try {
            const tx = await program.methods
                .createVesting(EVEN_LATER_AGAIN, new BN(1337e6))
                .accounts({...accounts, vest: vestEvenLaterAgain})
                .signers([admin])
                .rpc()
                .then(confirm)
                .then(log);
        } catch (e) {
            assert((e as anchor.AnchorError).error?.errorCode?.code === "VestingFinalized")
        }
    });

    it("Claim a vest after activation", async () => {
        const tx = await program.methods
            .claimVesting()
            .accounts({...accounts, vest: vestNow})
            .signers([vester])
            .rpc()
            .then(confirm)
            .then(log);
    });

    it("Fail to claim an unmatured vest", async () => {
        try {
            const tx = await program.methods
                .claimVesting()
                .accounts({...accounts, vest: vestLater})
                .signers([vester])
                .rpc()
                .then(confirm)
                .then(log);
        } catch (e) {
            console.log(e)
        }
    });
    it("Fail to claim an unmatured vest", async () => {
        try {
            const tx = await program.methods
                .claimVesting()
                .accounts({...accounts, vest: vestEvenLater})
                .signers([vester])
                .rpc()
                .then(confirm)
                .then(log);
        } catch (e) {
            assert((e as anchor.AnchorError).error?.errorCode?.code === "NotFullyVested")
        }
    });
    it("claim an unmatured vest", async () => {

        console.log("Waiting for vest to mature")
        await wait(60);
        const tx = await program.methods
            .claimVesting()
            .accounts({...accounts, vest: vestLater})
            .signers([vester])
            .rpc()
            .then(confirm)
            .then(log);
    });
    it("claim an another unmatured vest", async () => {

        console.log("Waiting for vest to mature")
        await wait(35);
        const tx = await program.methods
            .claimVesting()
            .accounts({...accounts, vest: vestEvenLater})
            .signers([vester])
            .rpc()
            .then(confirm)
            .then(log);
    });

    it("Withdraw surplus tokens", async () => {
        const tx = await program.methods
            .withdrawSurplus()
            .accounts({...accounts})
            .signers([admin])
            .rpc()
            .then(confirm)
            .then(log);
    });
});

