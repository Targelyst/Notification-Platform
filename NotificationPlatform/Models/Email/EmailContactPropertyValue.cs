using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Models.Email;

[InterfaceType]
[PrimaryKey(nameof(ContactId), nameof(PropertyId))]
public abstract class EmailContactPropertyValue : Entity {

    [GraphQLIgnore]
    public EmailContactPropertyType Type { get; set; }
    public Guid ContactId { get; set; }
    public EmailContact Contact { get; set; } = null!;

    public Guid PropertyId { get; set; }
    public EmailContactProperty Property { get; set; } = null!;

}

public abstract class EmailContactPropertyValueTyped<P, V> : EmailContactPropertyValue
where P : EmailContactProperty {

    public required V Value { get; set; }
    public new P Property { get; set; } = null!;

}

public class EmailContactStringPropertyValue
: EmailContactPropertyValueTyped<EmailContactStringProperty, string> { }

public class EmailContactNumberPropertyValue
: EmailContactPropertyValueTyped<EmailContactNumberProperty, double> { }

public class EmailContactDatePropertyValue
: EmailContactPropertyValueTyped<EmailContactDateProperty, DateOnly> { }

public class EmailContactChoicePropertyValue
: EmailContactPropertyValueTyped<EmailContactChoiceProperty, string> { }