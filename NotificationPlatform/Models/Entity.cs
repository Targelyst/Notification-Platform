using System.ComponentModel.DataAnnotations;

namespace NotificationPlatform.Models;

public abstract class Entity {

    [GraphQLIgnore]
    public required string Tenant { get; set; }

}

public abstract class KeyedEntity : Entity {

    [Key]
    public Guid Id { get; set; }

}