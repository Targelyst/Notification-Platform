using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Models;
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

    public DbSet<Project> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Project>().HasQueryFilter(e => e.Tenant == userService.Tenant);
    }

    public override void Dispose() {
        base.Dispose();
        this.serviceScope.Dispose();

        GC.SuppressFinalize(this);
    }

}