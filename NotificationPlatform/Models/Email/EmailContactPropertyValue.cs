using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Models.Email;

[PrimaryKey(nameof(ContactId), nameof(PropertyId))]
public class EmailContactPropertyValue : Entity {

    public Guid ContactId { get; set; }
    public EmailContact Contact { get; set; } = null!;

    public Guid PropertyId { get; set; }
    public EmailContactProperty Property { get; set; } = null!;

    public required string Value { get; set; }

}