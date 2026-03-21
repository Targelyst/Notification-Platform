using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using NotificationPlatform.Configuration;

namespace NotificationPlatform.Services;

public class CryptographyServiceAES(
    IOptions<SecurityConfiguration> config
) : ICryptographyService {

    public byte[] Encrypt(string data) {
        Rfc2898DeriveBytes keyBytes = new Rfc2898DeriveBytes(
            config.Value.EncryptionKey,
            8,
            1000,
            HashAlgorithmName.SHA256
        );

        using Aes aes = Aes.Create();
        aes.Key = keyBytes.GetBytes(32);
        aes.GenerateIV();

        ICryptoTransform encryptor = aes.CreateEncryptor();

        using MemoryStream msEncrypt = new();
        msEncrypt.Write(keyBytes.Salt);
        msEncrypt.Write(aes.IV);

        using (CryptoStream csEncrypt = new(msEncrypt, encryptor, CryptoStreamMode.Write)) {
            using StreamWriter swEncrypt = new(csEncrypt);
            swEncrypt.Write(data);
        }

        return msEncrypt.ToArray();
    }

    public string Decrypt(byte[] data) {
        Rfc2898DeriveBytes keyBytes = new Rfc2898DeriveBytes(
            config.Value.EncryptionKey,
            data[0..8],
            1000,
            HashAlgorithmName.SHA256
        );

        using Aes aes = Aes.Create();
        aes.Key = keyBytes.GetBytes(32);
        aes.IV = data[8..24];

        ICryptoTransform decryptor = aes.CreateDecryptor();

        using MemoryStream msDecrypt = new(data[24..]);
        using CryptoStream csDecrypt = new(msDecrypt, decryptor, CryptoStreamMode.Read);
        using StreamReader srDecrypt = new(csDecrypt);

        return srDecrypt.ReadToEnd();
    }

}