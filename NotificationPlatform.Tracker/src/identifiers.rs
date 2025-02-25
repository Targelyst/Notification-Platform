use sbee::{Sbee, SbeeDecodeError};
use serde::Deserialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum IdentifierDecodingError {
    #[error("error while decoding from Sbee")]
    DecodeError(#[from] SbeeDecodeError),

    #[error("error while deserializing from message pack")]
    DeserializationError(#[from] rmp_serde::decode::Error),
}

#[derive(PartialEq, Deserialize)]
pub(crate) struct TrackIdentifier {
    pub tenant: String,
    pub receiver: String,
    pub campaign: String,
}

#[derive(PartialEq, Deserialize)]
pub(crate) struct ProxyIdentifier {
    pub tenant: String,
    pub receiver: String,
    pub url: String,
    pub campaign: String,
}

pub trait Identifier {
    fn from_string(sbee: &Sbee, input: &str) -> Result<Self, IdentifierDecodingError>
    where
        Self: std::marker::Sized;
}

impl Identifier for TrackIdentifier {
    fn from_string(sbee: &Sbee, input: &str) -> Result<Self, IdentifierDecodingError> {
        let identifier_decrypted = sbee.decode(input)?;
        let identifier = rmp_serde::from_slice::<TrackIdentifier>(&identifier_decrypted)?;

        Ok(identifier)
    }
}

impl Identifier for ProxyIdentifier {
    fn from_string(sbee: &Sbee, input: &str) -> Result<Self, IdentifierDecodingError> {
        let identifier_decrypted = sbee.decode(input)?;
        let identifier = rmp_serde::from_slice::<ProxyIdentifier>(&identifier_decrypted)?;

        Ok(identifier)
    }
}
