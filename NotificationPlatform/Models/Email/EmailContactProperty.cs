using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Models.Email;

public enum EmailContactPropertyType {
    String,
    Number,
    Date,
    Choice
}

[InterfaceType]
[Index(nameof(Type), nameof(Name), IsUnique = true)]
public abstract class EmailContactProperty : KeyedEntity {

    public EmailContactPropertyType Type { get; set; }
    public required string Name { get; set; }
    public bool Show { get; set; } = true;

    public Guid EmailConfigurationId { get; set; }
    public EmailConfiguration EmailConfiguration { get; set; } = null!;

    public List<EmailContactPropertyValue> Values { get; set; } = [];

}

public class EmailContactStringProperty : EmailContactProperty { }

public class EmailContactNumberProperty : EmailContactProperty { }

public class EmailContactDateProperty : EmailContactProperty { }

public class EmailContactChoiceProperty : EmailContactProperty {

    public required string[] Choices { get; set; } = [];

}