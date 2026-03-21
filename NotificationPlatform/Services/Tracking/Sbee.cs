using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using NSec.Cryptography;

namespace NotificationPlatform.Services.Tracking;

public class SbeeDecryptionException(string message)
    : Exception(message);

public sealed class Sbee(byte[] key) : IDisposable {

    private readonly Key key = Key.Import(AeadAlgorithm.XChaCha20Poly1305, key, KeyBlobFormat.RawSymmetricKey);

    public string Encode(byte[] message) {
        var nonce = new byte[24];
        RandomNumberGenerator.Create().GetBytes(nonce);

        var ciphertext = AeadAlgorithm.XChaCha20Poly1305.Encrypt(this.key, nonce, null, message);

        byte[] token = new byte[nonce.Length + ciphertext.Length];
        Buffer.BlockCopy(nonce, 0, token, 0, nonce.Length);
        Buffer.BlockCopy(ciphertext, 0, token, nonce.Length, ciphertext.Length);

        return Base64UrlEncoder.Encode(token).TrimEnd('=');
    }

    public byte[] Decode(string token) {
        byte[] tokenBytes = Base64UrlEncoder.DecodeBytes(token);

        var nonce = tokenBytes[0..24];
        var decrypted = AeadAlgorithm.XChaCha20Poly1305.Decrypt(this.key, nonce, null, tokenBytes.AsSpan()[24..])
            ?? throw new SbeeDecryptionException("Decryption result it null.");

        return decrypted;
    }

    public void Dispose() {
        this.key.Dispose();
    }

}