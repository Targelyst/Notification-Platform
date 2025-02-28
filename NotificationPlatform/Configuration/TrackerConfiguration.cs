namespace NotificationPlatform.Configuration;

public class TrackerConfiguration {
    public const string Section = "Tracker";

    public required string ExternalBaseUrl { get; set; }
    public required string TokenKey { get; set; }
}