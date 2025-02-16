namespace NotificationPlatform.Configuration;

public class SecurityConfiguration {
    public const string Section = "Security";

    public required string EncryptionKey { get; set; }
}