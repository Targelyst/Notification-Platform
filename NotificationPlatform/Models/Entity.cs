using System.ComponentModel.DataAnnotations;

namespace NotificationPlatform.Models;

public abstract class Entity {
    [Key]
    public Guid Id { get; set; }
}