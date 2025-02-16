namespace NotificationPlatform.Services;

public interface ICryptographyService {

    byte[] Encrypt(string data);
    string Decrypt(byte[] data);

}