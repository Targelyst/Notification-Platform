using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Models.Email;

[Index(nameof(TransportId), nameof(Address), IsUnique = true)]
public class EmailTransportSenderAddress : KeyedEntity {

    [GraphQLType<EmailAddressType>]
    public required string Address { get; set; }

    public Guid TransportId { get; set; }
    public EmailTransport Transport { get; set; } = null!;

}