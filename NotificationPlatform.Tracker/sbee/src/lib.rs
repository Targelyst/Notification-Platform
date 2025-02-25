use base64::prelude::BASE64_URL_SAFE_NO_PAD as b64;
use base64::Engine;
use chacha20poly1305::aead::OsRng;
use chacha20poly1305::AeadCore;
use chacha20poly1305::Key;
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305,
};
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum SbeeEncodeError {
    #[error("encryption error")]
    EncryptionError(chacha20poly1305::Error),
}

#[derive(Error, Debug, PartialEq)]
pub enum SbeeDecodeError {
    #[error("base 64 decoding error")]
    Base64Error(#[from] base64::DecodeError),

    #[error("provided token is too short")]
    TokenTooShort,

    #[error("decryption error")]
    DecryptionError(chacha20poly1305::Error),
}

pub struct Sbee {
    cipher: XChaCha20Poly1305,
}

impl Sbee {
    pub fn new(key: &Key) -> Self {
        let cipher = XChaCha20Poly1305::new(key);
        Sbee { cipher }
    }

    pub fn encode(&self, message: &[u8]) -> Result<String, SbeeEncodeError> {
        let nonce = XChaCha20Poly1305::generate_nonce(&mut OsRng);
        let mut token = nonce.to_vec();

        let ciphertext = self
            .cipher
            .encrypt(&nonce, message)
            .map_err(SbeeEncodeError::EncryptionError)?;

        token.extend_from_slice(&ciphertext);

        Ok(b64.encode(&token))
    }

    pub fn decode(&self, token: &str) -> Result<Vec<u8>, SbeeDecodeError> {
        let token = b64.decode(token)?;

        if token.len() < 25 {
            return Err(SbeeDecodeError::TokenTooShort);
        }

        let nonce = &token[0..24];
        let message_encrypted = &token[24..];

        let message = self
            .cipher
            .decrypt(nonce.into(), message_encrypted)
            .map_err(SbeeDecodeError::DecryptionError)?;

        Ok(message)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encrypts_and_decrypts_correctly_simple() {
        let key = [
            1u8, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32,
        ];
        let message = b"test message";

        let sbee = Sbee::new(&key.into());
        let encoded = sbee.encode(message).unwrap();
        let decoded = sbee.decode(&encoded).unwrap();

        assert_eq!(message, &decoded[..]);
    }

    #[test]
    fn rejects_too_short() {
        let key = [
            1u8, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32,
        ];

        let sbee = Sbee::new(&key.into());
        let result = sbee.decode("basemsg");

        assert!(result.is_err());
        assert_eq!(result, Err(SbeeDecodeError::TokenTooShort))
    }

    #[test]
    fn rejects_invalid_base64() {
        let key = [
            1u8, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
            24, 25, 26, 27, 28, 29, 30, 31, 32,
        ];

        let sbee = Sbee::new(&key.into());
        let result = sbee.decode("invalidbase64!!!");

        assert!(result.is_err());
        assert!(matches!(result, Err(SbeeDecodeError::Base64Error(_))))
    }
}
