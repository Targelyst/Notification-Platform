using System.ComponentModel.DataAnnotations;

namespace NotificationPlatform.Configuration;

public class DatabaseConfiguration {
    public const string Section = "Database";

    [Required]
    public required string Host { get; set; }

    [Required]
    public required int Port { get; set; }

    [Required]
    public required string Database { get; set; }

    [Required]
    public required string User { get; set; }

    [Required]
    public required string Password { get; set; }
}