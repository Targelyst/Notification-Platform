using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Models.Email.Tracking;

[Keyless]
public class ProxiedEvent {

    public DateTime Time { get; set; } = DateTime.UtcNow;
    public required string Tenant { get; set; }
    public required string Url { get; set; }

    public required uint Value { get; set; }

    // public Guid SegmentId { get; set; }

    public Guid ContactId { get; set; }
    public EmailContact Contact { get; set; } = null!;

}