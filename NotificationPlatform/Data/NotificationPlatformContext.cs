using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Models;
using NotificationPlatform.Models.Email;
using NotificationPlatform.Services;

namespace NotificationPlatform.Data;

public class NotificationPlatformContext : DbContext {

    private readonly IServiceScope serviceScope;
    private readonly IUserService userService;
    private readonly ICryptographyService cryptographyService;

    public NotificationPlatformContext(
        DbContextOptions<NotificationPlatformContext> options,
        IServiceScopeFactory serviceScopeFactory,
        ICryptographyService cryptographyService
    ) : base(options) {
        this.serviceScope = serviceScopeFactory.CreateScope();
        this.userService = this.serviceScope.ServiceProvider.GetRequiredService<IUserService>();
        this.cryptographyService = cryptographyService;
    }

    public DbSet<EmailConfiguration> EmailConfigurations { get; set; }
    public DbSet<EmailContact> EmailContacts { get; set; }
    public DbSet<EmailContactChoiceProperty> EmailContactChoiceProperties { get; set; }
    public DbSet<EmailContactDateProperty> EmailContactDateProperties { get; set; }
    public DbSet<EmailContactNumberProperty> EmailContactNumberProperties { get; set; }
    public DbSet<EmailContactProperty> EmailContactProperties { get; set; }
    public DbSet<EmailContactPropertyValue> EmailContactPropertyValues { get; set; }
    public DbSet<EmailContactStringProperty> EmailContactStringProperties { get; set; }
    public DbSet<EmailSegment> EmailSegments { get; set; }
    public DbSet<EmailTransport> EmailTransports { get; set; }
    public DbSet<EmailTransportSenderAddress> EmailTransportSenderAddresses { get; set; }
    public DbSet<Project> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        configureColumnEncryption(modelBuilder);

        modelBuilder.Entity<EmailContactProperty>()
            .HasDiscriminator(p => p.Type)
            .HasValue<EmailContactStringProperty>(EmailContactPropertyType.String)
            .HasValue<EmailContactNumberProperty>(EmailContactPropertyType.Number)
            .HasValue<EmailContactDateProperty>(EmailContactPropertyType.Date)
            .HasValue<EmailContactChoiceProperty>(EmailContactPropertyType.Choice);

        modelBuilder.Entity<EmailConfiguration>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailContact>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailContactProperty>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailContactPropertyValue>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailSegment>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailTransport>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<EmailTransportSenderAddress>().HasQueryFilter(e => e.Tenant == userService.Tenant);
        modelBuilder.Entity<Project>().HasQueryFilter(e => e.Tenant == userService.Tenant);
    }

    public override void Dispose() {
        base.Dispose();
        this.serviceScope.Dispose();

        GC.SuppressFinalize(this);
    }

    private void configureColumnEncryption(ModelBuilder modelBuilder) {
        var converter = new EncryptedConverter(this.cryptographyService);

        modelBuilder.Entity<EmailTransport>()
            .Property(et => et.Password)
            .HasConversion(converter);
    }

}