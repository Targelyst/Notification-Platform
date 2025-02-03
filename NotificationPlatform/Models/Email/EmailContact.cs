namespace NotificationPlatform.Models.Email;

public class EmailContact : KeyedEntity {

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required string EmailAddress { get; set; }

    public Guid EmailConfigurationId { get; set; }
    public EmailConfiguration EmailConfiguration { get; set; } = null!;

    public List<EmailContactPropertyValue> Properties { get; set; } = [];

}