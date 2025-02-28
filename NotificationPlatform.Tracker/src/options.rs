use std::{num::ParseIntError, time::Duration};

use clap::Parser;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum SbeeKeyParseError {
    #[error("invalid hexadecimal character '{0}' at position {1}")]
    InvalidHexCharacter(char, usize),

    #[error("key must be exactly 32 bytes long, is {0} bytes long")]
    TooShort(usize),

    #[error("number of digits must be even")]
    OddNumberOfDigits,
}

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub(crate) struct Options {
    /// Address to bind the HTTP server to
    #[arg(short, long, default_value = "0.0.0.0:8080", env)]
    pub address: String,

    /// Secret key that encrypted the identifier encoded as hexadecimal string
    #[arg(short, long, env, value_parser(parse_sbee_key))]
    pub key: [u8; 32],

    /// Size of the batches to write into the database
    #[arg(short, long, env, default_value_t = 100)]
    pub batch_size: usize,

    /// User for the database
    #[arg(long, env)]
    pub db_user: String,

    /// Password for the database
    #[arg(long, env)]
    pub db_password: String,

    /// Host of the database
    #[arg(long, env)]
    pub db_host: String,

    /// Name of database
    #[arg(long, env)]
    pub db_database: String,

    /// Timeout after which events should be flushed
    #[arg(short, long, env, value_parser(parse_duration))]
    pub timeout: Duration,
}

pub(crate) fn parse_sbee_key(value: &str) -> Result<[u8; 32], SbeeKeyParseError> {
    let mut decoded_key = [0; 32];
    hex::decode_to_slice(value, &mut decoded_key).map_err(|e| match e {
        hex::FromHexError::InvalidHexCharacter { c, index } => {
            SbeeKeyParseError::InvalidHexCharacter(c, index)
        }
        hex::FromHexError::OddLength => SbeeKeyParseError::OddNumberOfDigits,
        hex::FromHexError::InvalidStringLength => SbeeKeyParseError::TooShort(value.len() / 2),
    })?;

    if decoded_key.len() != 32 {
        Err(SbeeKeyParseError::TooShort(decoded_key.len()))
    } else {
        Ok(decoded_key)
    }
}

fn parse_duration(arg: &str) -> Result<Duration, ParseIntError> {
    let seconds = arg.parse()?;
    Ok(Duration::from_secs(seconds))
}
