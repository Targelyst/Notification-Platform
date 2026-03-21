using NotificationPlatform.Data;

namespace NotificationPlatform.Models.Email;

public class EmailTransport : KeyedEntity {

    public required string Host { get; set; }
    public required int Port { get; set; }
    public required string User { get; set; }

    [GraphQLIgnore]
    public required string Password { get; set; }

    public Guid EmailConfigurationId { get; set; }
    public EmailConfiguration EmailConfiguration { get; set; } = null!;

    [UseFiltering]
    [UseSorting]
    public List<EmailTransportSenderAddress> SenderAddresses { get; set; } = [];

}