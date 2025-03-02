use sbee::{Sbee, SbeeDecodeError};
use serde::{Deserialize, Serialize};
use thiserror::Error;
use uuid::Uuid;

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
    #[serde(with = "hyphenated")]
    pub contact: Uuid,
}

#[derive(PartialEq, Deserialize, Serialize)]
pub(crate) struct ProxyIdentifier {
    pub tenant: String,
    #[serde(with = "hyphenated")]
    pub contact: Uuid,
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

mod hyphenated {
    use serde::{de, Deserialize};
    use uuid::Uuid;

    pub fn serialize<S>(u: &Uuid, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serde::Serialize::serialize(u.as_hyphenated(), serializer)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Uuid, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = <&str as Deserialize>::deserialize(deserializer)?;
        let uuid = Uuid::try_parse(s)
            .map_err(|_| de::Error::invalid_value(de::Unexpected::Str(s), &"a hyphenated UUID"))?;
        Ok(uuid)
    }
}
