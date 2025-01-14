# vesting-token-solana-rust

## Overview

This project is a Solana program written in Rust that implements a token vesting mechanism. The purpose of this program
is to manage the release of tokens over a specified period, ensuring that tokens are gradually made available to the
recipient according to a predefined schedule.

## Features

- **Token Vesting**: Allows tokens to be released over time according to a vesting schedule.
- **Cliff Period**: Supports an initial cliff period where no tokens are released.
- **Custom Schedules**: Enables the creation of custom vesting schedules tailored to specific needs.
- **Secure**: Ensures that tokens are securely managed and only released according to the schedule.

## Program ID

- `Anchor.toml`:
  ```toml
  [programs.localnet]
  vesting_token_solana_rust = "ProgramIDHere"# vesting-token-solana-rust

- `vesting_token_2024.ts`:

```.TS
      lib.rs:
      use anchor_lang::prelude::*;

declare_id!("ProgramIDHere");

#[program]
pub mod vesting_token_solana_rust {
use super::*;
// Your program code here
}
  ```
## Getting Started
  ### Prerequisites
  - Rust and Cargo installed
  - Solana CLI installed
  - Node.js and Yarn or npm installed