using System.ComponentModel.DataAnnotations;

namespace NotificationPlatform.Configuration;

public class AuthConfiguration {
    public const string Section = "Auth";

    [Required]
    public required string MetadataAddress { get; set; }

    [Required]
    public required Uri BaseUrl { get; set; }

    [Required]
    public required string ApiKey { get; set; }

    [Required]
    public required string Audience { get; set; }

    public string TenantClaim { get; set; } = "tenant";
}