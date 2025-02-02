namespace NotificationPlatform.Models.Email;

public class EmailConfiguration : Entity {

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public List<EmailContact> EmailContacts { get; set; } = [];
    public List<EmailContactProperty> EmailContactProperties { get; set; } = [];

}