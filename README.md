# Solana Counter Program

A simple yet comprehensive example of a Solana program (smart contract) that demonstrates fundamental blockchain development concepts. This counter program allows incrementing and decrementing a stored value on the Solana blockchain.

## 🎯 What This Project Is

This is a basic Solana program written in Rust that maintains a counter value in a blockchain account. Users can send transactions to increment or decrement the counter, and the new value persists on-chain. The project includes both the on-chain program (Rust) and client-side tests (TypeScript) that interact with the program.

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) installed
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) installed
- [Bun](https://bun.sh/) for running TypeScript tests
- A local Solana validator running

### Installation

1. Clone and navigate to the project:

```bash
git clone <your-repo-url>
cd solana-counter-program
```

2. Install TypeScript dependencies:

```bash
bun install
```

3. Start a local Solana validator (in a separate terminal):

```bash
solana-test-validator
```

4. Build and deploy the Solana program:

```bash
cargo build-sbf
solana program deploy target/deploy/counter_program.so
```

5. Run the tests:

```bash
bun test
```

## 📁 Project Structure

```
├── src/
│   └── lib.rs              # Main Solana program (Rust)
├── tests/
│   ├── index.test.ts       # Client-side tests (TypeScript)
│   ├── instruction.ts      # Instruction helpers (TODO)
│   └── package.json        # Test dependencies
├── Cargo.toml              # Rust dependencies
└── README.md               # This file
```

## 🧠 Key Concepts Learned

### 1. **Solana Program Architecture**

- **Programs are stateless**: Unlike Ethereum smart contracts, Solana programs don't store state internally
- **Account model**: State is stored in separate accounts that programs can read/write to
- **Entry points**: Programs have a single entry point function that processes all instructions

### 2. **Data Serialization with Borsh**

- **Cross-language compatibility**: Both Rust and TypeScript use Borsh for consistent data serialization
- **Schema definition**: Data structures must be precisely defined to ensure proper serialization/deserialization
- **Binary format**: Efficient binary encoding reduces transaction costs

### 3. **Account Management**

- **Rent exemption**: Accounts must maintain minimum balances to avoid deletion
- **Program ownership**: Accounts are owned by programs that can modify their data
- **Space allocation**: Must pre-calculate and allocate exact space needed for account data

### 4. **Transaction Processing**

- **Instruction parsing**: Programs receive raw bytes that must be deserialized into instructions
- **Account iteration**: Programs work with arrays of accounts passed in transactions
- **Error handling**: Proper error propagation using Rust's `Result` type

### 5. **Client-Side Interaction**

- **Web3.js integration**: TypeScript clients use Solana's Web3.js library
- **Connection management**: Managing connections to Solana RPC endpoints
- **Transaction construction**: Building and sending transactions with proper instruction data

### 6. **Testing and Development**

- **Local validator**: Using `solana-test-validator` for development and testing
- **Airdrop functionality**: Getting test SOL for development (devnet/localnet only)
- **Transaction confirmation**: Waiting for transactions to be confirmed before proceeding

## 🏗️ Program Flow

1. **Deployment**: The Rust program is compiled and deployed to Solana
2. **Account Creation**: Client creates an account owned by the program to store counter data
3. **Instruction Sending**: Client sends increment/decrement instructions with serialized data
4. **Program Execution**: Program deserializes instruction, updates counter, and saves to account
5. **State Persistence**: Updated counter value persists on the blockchain

## 🔧 Technical Implementation

### Rust Program (`src/lib.rs`)

- Defines `Counter` struct for data storage
- Implements `CounterInstruction` enum for different operations
- Uses Borsh traits for serialization
- Processes instructions and updates account data

### TypeScript Tests (`tests/index.test.ts`)

- Mirrors Rust data structures in TypeScript
- Handles account creation and management
- Tests program functionality end-to-end
- Demonstrates client-side transaction construction

## 🎓 Learning Outcomes

After working through this project, you'll understand:

- ✅ How Solana's account model differs from other blockchains
- ✅ The relationship between programs and accounts
- ✅ Cross-language serialization with Borsh
- ✅ Solana transaction and instruction structure
- ✅ Local development workflow with Solana CLI
- ✅ Client-side integration with Web3.js
- ✅ Error handling in blockchain applications
- ✅ Testing strategies for blockchain programs

## 🔄 Next Steps

To extend this project, consider:

1. **Add more instruction types** (reset counter, set specific value)
2. **Implement authorization** (only allow certain accounts to modify)
3. **Add instruction helpers** (complete the `instruction.ts` file)
4. **Create a web frontend** to interact with the program
5. **Deploy to devnet** for broader testing
6. **Add comprehensive error handling** for edge cases

## 🛠️ Development Commands

```bash
# Build the Solana program
cargo build-sbf

# Deploy to local validator
solana program deploy target/deploy/counter_program.so

# Run TypeScript tests
bun test

# Start local validator (separate terminal)
solana-test-validator

# Check program logs
solana logs
```

---

This project serves as a solid foundation for understanding Solana development and can be extended into more complex applications. The combination of Rust for on-chain logic and TypeScript for client interaction provides a complete full-stack blockchain development experience.
