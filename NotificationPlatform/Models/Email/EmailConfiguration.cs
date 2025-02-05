namespace NotificationPlatform.Models.Email;

public class EmailConfiguration : KeyedEntity {

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    [GraphQLIgnore]
    public List<EmailContact> Contacts { get; set; } = [];

    [UseFiltering]
    [UseSorting]
    public List<EmailContactProperty> Properties { get; set; } = [];

    [UseFiltering]
    [UseSorting]
    public List<EmailTransport> Transports { get; set; } = [];

}