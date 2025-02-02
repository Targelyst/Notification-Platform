using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Models;

public class Project : KeyedEntity {

    public required string Name { get; set; }

    public EmailConfiguration? EmailConfiguration { get; set; }

}