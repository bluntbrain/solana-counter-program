// Import testing utilities and blockchain interaction libraries
import { expect, test } from "bun:test";
import * as borsh from "borsh";  // Library for binary serialization (same as used in Rust program)
import { 
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey, 
    SystemProgram, 
    Transaction, 
    TransactionInstruction 
} from "@solana/web3.js";

// TODO: Uncomment when instruction helpers are implemented
// import { CounterInstruction, CounterInstructionSchema, CounterInstructionType, createIncrementInstructionData, createDecrementInstructionData } from "./instruction";

/**
 * TypeScript representation of the Counter account data structure
 * This mirrors the Counter struct in our Rust program
 */
class CounterAccount {
    count = 0;

    constructor({count}: {count: number}) {
        this.count = count;
    }
}

// Define the Borsh schema for serializing/deserializing counter data
// This must match the Rust Counter struct exactly
const schema: borsh.Schema = { struct: { count: 'u32'}};

// Calculate the size needed for a counter account by serializing a sample
// This ensures we allocate enough space when creating the account on Solana
const GREETING_SIZE = borsh.serialize(
    schema,
    new CounterAccount({count: 0})
).length;

// Test serialization to ensure our schema works correctly
const counter = new CounterAccount({count: 1});
console.log(borsh.serialize(schema, counter));

// The deployed program's public key - this is where our counter program lives on Solana
const programId = new PublicKey("CQQP6NYLvbwwZd9hssQM5p45tumGQGGc5m7wGBiXHpgU");

// Generate keypairs for testing
let adminAccount = Keypair.generate();  // Account that will fund operations
let dataAccount = Keypair.generate();   // Account that will store counter data

// Connect to local Solana test validator (devnet)
// The RPC endpoint should match your local solana-test-validator
const connection = new Connection("http://127.0.0.1:8899", "confirmed");

/**
 * Test to set up accounts needed for counter program testing
 * This test demonstrates the basic Solana account creation workflow
 */
test("account setup", async () => {
   
    // Request an airdrop of SOL to fund our admin account
    // This is only possible on devnet/testnet - not on mainnet
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(txn);
    
    // Verify the airdrop was successful
    const data = await connection.getAccountInfo(adminAccount.publicKey);
    if (!data) {
        throw new Error("Failed to airdrop SOL");
    }
    console.log("Airdrop completed", data?.lamports / LAMPORTS_PER_SOL, "SOL");

    // Calculate minimum lamports needed for rent exemption
    // Solana requires accounts to maintain a minimum balance to avoid being deleted
    const lamports = await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);

    // Create instruction to create a new account for storing counter data
    // This account will be owned by our counter program
    const createCounterAccountIx = SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey,    // Account paying for creation
        lamports,                              // Rent-exempt balance
        newAccountPubkey: dataAccount.publicKey, // New account's address
        programId: programId,                  // Program that will own this account
        space: GREETING_SIZE,                  // Space needed to store counter data
    });

    // Create and send transaction to create the counter account
    const tx = new Transaction().add(createCounterAccountIx);
    const txHash = await connection.sendTransaction(tx, [adminAccount, dataAccount]);
    await connection.confirmTransaction(txHash);
    console.log("Counter account created with transaction hash:", txHash, dataAccount.publicKey.toBase58());

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    if (!dataAccountInfo) {
        throw new Error("Failed to get counter account info");
    }
    const counter = borsh.deserialize(schema, dataAccountInfo.data) as CounterAccount;
    if (!counter) {
        throw new Error("Failed to deserialize counter account");
    }
    console.log("Counter account initialized with count:", counter.count);
    expect(counter.count).toBe(0); // Initial count should be 0
});