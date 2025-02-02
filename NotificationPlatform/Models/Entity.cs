using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Models;

public abstract class Entity {

    [Key]
    public Guid Id { get; set; }

    [GraphQLIgnore]
    public required string Tenant { get; set; }

}