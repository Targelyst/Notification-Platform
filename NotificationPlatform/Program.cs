using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Configuration;
using NotificationPlatform.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions<DatabaseConfiguration>()
  .Bind(builder.Configuration.GetSection(DatabaseConfiguration.Section))
  .ValidateDataAnnotations()
  .ValidateOnStart();

builder.Services.AddDbContextFactory<NotificationPlatformContext>(opt => {
    var c = builder.Configuration.GetSection(DatabaseConfiguration.Section).Get<DatabaseConfiguration>()
      ?? throw new Exception($"Could not get configuration section {DatabaseConfiguration.Section}");

    opt.UseNpgsql($"Host={c.Host};Port={c.Port};Database={c.Database};Username={c.User};Password={c.Password}");
});

builder.Services
    .AddGraphQLServer()
    .RegisterDbContextFactory<NotificationPlatformContext>()
    .AddTypes();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);