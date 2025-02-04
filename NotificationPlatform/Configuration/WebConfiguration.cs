namespace NotificationPlatform.Configuration;

public class WebConfiguration {
    public const string Section = "Web";

    public required string[] CorsOrigins { get; set; } = [];
}