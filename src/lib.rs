// Import necessary dependencies from borsh for serialization/deserialization
use borsh::{BorshDeserialize, BorshSerialize};
// Import Solana program utilities
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,                // Macro to define program entry point
    entrypoint::ProgramResult, // Result type for program execution
    msg,                       // Macro for logging messages on-chain
    pubkey::Pubkey,            // Public key type
};

/// Counter data structure that will be stored in a Solana account
/// This struct represents the state of our counter program
#[derive(BorshSerialize, BorshDeserialize)]
struct Counter {
    count: u32, // The current counter value (32-bit unsigned integer)
}

/// Enum representing different instructions our program can handle
/// Each variant represents a different operation the program can perform
#[derive(BorshSerialize, BorshDeserialize)]
enum CounterInstruction {
    /// Increment the counter by a specified amount
    Increment(u32),
    /// Decrement the counter by a specified amount  
    Decrement(u32),
}

// Define the entry point for our Solana program
// This macro tells Solana that process_instruction is the main function to call
entrypoint!(process_instruction);

/// Main instruction processing function
/// This function is called whenever a transaction invokes our program
///
/// Arguments:
/// - _program_id: The public key of our deployed program (unused in this example)
/// - accounts: Array of accounts involved in the transaction
/// - instruction_data: Raw bytes containing the instruction to execute
///
/// Returns: ProgramResult (Ok() on success, Err() on failure)
pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8], // Raw instruction bytes (e.g., [0, 0, 0, 1] for increment by 1)
) -> ProgramResult {
    // Get the first account from the accounts array - this is our counter data account
    // The ? operator propagates any error if the account doesn't exist
    let account = next_account_info(&mut accounts.iter())?;

    // Deserialize the current counter data from the account's data field
    // try_from_slice converts the raw bytes back into our Counter struct
    let mut counter = Counter::try_from_slice(&account.data.borrow())?;

    // Parse the instruction data to determine what operation to perform
    // The instruction data contains serialized CounterInstruction enum
    match CounterInstruction::try_from_slice(instruction_data)? {
        CounterInstruction::Increment(amount) => {
            // Add the specified amount to the current counter value
            counter.count += amount;
        }
        CounterInstruction::Decrement(amount) => {
            // Subtract the specified amount from the current counter value
            counter.count -= amount;
        }
    }

    // Serialize the updated counter back to the account's data field
    // This persists the new counter value on the blockchain
    counter.serialize(&mut *account.data.borrow_mut())?;

    // Log the updated counter value (visible in transaction logs)
    msg!("Counter updated to {}", counter.count);

    // Return success
    Ok(())
}
