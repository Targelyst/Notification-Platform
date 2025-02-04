namespace NotificationPlatform.Data;

public static class SeedingExtensions {
    public static IHost UseSeeding(this IHost host) {
        using (var scope = host.Services.CreateScope()) {
            var db = scope
                .ServiceProvider
                .GetRequiredService<NotificationPlatformContext>();

            DevelopmentSeeder.Seed(db);
        }

        return host;
    }
}