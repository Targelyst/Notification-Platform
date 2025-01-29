using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Models;

namespace NotificationPlatform.Data;

public class NotificationPlatformContext(
    DbContextOptions<NotificationPlatformContext> options
) : DbContext(options) {
    public DbSet<Partner> Partners { get; set; }
}