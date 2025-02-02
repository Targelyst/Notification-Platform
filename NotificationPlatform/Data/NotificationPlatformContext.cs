using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Models;
using NotificationPlatform.Models.Email;
using NotificationPlatform.Services;

namespace NotificationPlatform.Data;

public class NotificationPlatformContext : DbContext {

    private readonly IServiceScope serviceScope;
    private readonly IUserService userService;

    public NotificationPlatformContext(
        DbContextOptions<NotificationPlatformContext> options,
        IServiceScopeFactory serviceScopeFactory
    ) : base(options) {
        this.serviceScope = serviceScopeFactory.CreateScope();
        this.userService = this.serviceScope.ServiceProvider.GetRequiredService<IUserService>();
    }

    public DbSet<EmailConfiguration> EmailConfigurations { get; set; }
    public DbSet<EmailContact> EmailContacts { get; set; }
    public DbSet<EmailContactChoiceProperty> EmailContactChoiceProperties { get; set; }
    public DbSet<EmailContactDateProperty> EmailContactDateProperties { get; set; }
    public DbSet<EmailContactNumberProperty> EmailContactNumberProperties { get; set; }
    public DbSet<EmailContactProperty> EmailContactProperties { get; set; }
    public DbSet<EmailContactStringProperty> EmailContactStringProperties { get; set; }
    public DbSet<Project> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<EmailContactProperty>()
            .HasDiscriminator(p => p.Type)
            .HasValue<EmailContactStringProperty>(EmailContactPropertyType.String)
            .HasValue<EmailContactNumberProperty>(EmailContactPropertyType.Number)
            .HasValue<EmailContactDateProperty>(EmailContactPropertyType.Date)
            .HasValue<EmailContactChoiceProperty>(EmailContactPropertyType.Choice);

        modelBuilder.Entity<EmailConfiguration>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailContact>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailContactProperty>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<Project>().HasQueryFilter(e => e.Tenant == userService.Tenant);
    }

    public override void Dispose() {
        base.Dispose();
        this.serviceScope.Dispose();

        GC.SuppressFinalize(this);
    }

}