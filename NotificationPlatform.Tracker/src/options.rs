use clap::{value_parser, Parser};
use thiserror::Error;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
pub(crate) struct Options {
    /// Address to bind the HTTP server to
    #[arg(short, long, default_value = "0.0.0.0:8080", env)]
    pub address: String,

    /// Secret key that encrypted the identifier encoded as hexadecimal string
    #[arg(short, long, env, value_parser(parse_sbee_key))]
    pub key: [u8; 32],
}

#[derive(Debug, Error)]
pub enum SbeeKeyParseError {
    #[error("error while decoding hexadecimal string: {0}")]
    HexDecodeError(#[from] hex::FromHexError),

    #[error("key must be exactly 32 bytes long, is {0} bytes long")]
    TooShort(usize),

    #[error("number of digits must be even")]
    OddNumberOfDigits,
}

pub(crate) fn parse_sbee_key(value: &str) -> Result<[u8; 32], SbeeKeyParseError> {
    if value.len() % 2 != 0 {
        return Err(SbeeKeyParseError::OddNumberOfDigits);
    }

    if value.len() != 64 {
        return Err(SbeeKeyParseError::TooShort(value.len() / 2));
    }

    let mut decoded_key = [0; 32];
    hex::decode_to_slice(value, &mut decoded_key)?;

    if decoded_key.len() != 32 {
        Err(SbeeKeyParseError::TooShort(decoded_key.len()))
    } else {
        Ok(decoded_key)
    }
}
