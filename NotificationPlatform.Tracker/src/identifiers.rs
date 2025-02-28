use sbee::{Sbee, SbeeDecodeError};
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum IdentifierDecodingError {
    #[error("error while decoding from Sbee: {0}")]
    DecodeError(#[from] SbeeDecodeError),

    #[error("error while deserializing from message pack: {0}")]
    DeserializationError(#[from] rmp_serde::decode::Error),
}

#[derive(PartialEq, Deserialize, Serialize)]
pub(crate) struct TrackIdentifier {
    pub tenant: String,
    pub contact: String,
}

#[derive(PartialEq, Deserialize)]
pub(crate) struct ProxyIdentifier {
    pub tenant: String,
    pub contact: String,
    pub url: String,
}

pub trait Identifier {
    fn from_string(sbee: &Sbee, input: &str) -> Result<Self, IdentifierDecodingError>
    where
        Self: std::marker::Sized,
        Self: for<'a> Deserialize<'a>,
    {
        let identifier_decrypted = sbee.decode(input)?;
        let identifier = rmp_serde::from_slice::<Self>(&identifier_decrypted)?;

        Ok(identifier)
    }
}

impl Identifier for TrackIdentifier {}
impl Identifier for ProxyIdentifier {}
