namespace NotificationPlatform.Models.Email;

public class EmailContact : KeyedEntity {

    public required string EmailAddress { get; set; }

    public List<EmailContactPropertyValue> Properties { get; set; } = [];

}