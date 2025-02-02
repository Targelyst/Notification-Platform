namespace NotificationPlatform.Models.Email;

public class EmailConfiguration : KeyedEntity {

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public List<EmailContact> Contacts { get; set; } = [];
    public List<EmailContactProperty> Properties { get; set; } = [];

}