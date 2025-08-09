# Solana Counter Program

A basic Solana program that maintains a counter value on-chain. Supports increment and decrement operations.

## Setup

```bash
# Install dependencies
bun install

# Start local validator
solana-test-validator

# Build and deploy program
cargo build-sbf
solana program deploy target/deploy/counter_program.so

# Run tests
bun test
```

## What You'll Learn

- Solana's account model and stateless programs
- Cross-language serialization with Borsh
- Account creation and rent exemption
- Transaction construction and instruction processing
- Client-side integration with Web3.js
- Local development with test validators

## Architecture

- `src/lib.rs` - Rust program with Counter struct and increment/decrement logic
- `tests/index.test.ts` - TypeScript tests demonstrating client interaction
- Counter data stored in separate accounts owned by the program
- Instructions serialized with Borsh for cross-language compatibility
