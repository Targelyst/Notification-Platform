using NotificationPlatform.Configuration;
using NotificationPlatform.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions<DatabaseConfiguration>()
  .Bind(builder.Configuration.GetSection(DatabaseConfiguration.Section))
  .ValidateDataAnnotations()
  .ValidateOnStart();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddDbContextPool<NotificationPlatformContext>(opt => {
    var c = builder.Configuration.GetSection(DatabaseConfiguration.Section).Get<DatabaseConfiguration>()
      ?? throw new Exception($"Could not get configuration section {DatabaseConfiguration.Section}");

    opt.UseNpgsql($"Host={c.Host};Port={c.Port};Database={c.Database};Username={c.User};Password={c.Password}");
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapControllers();

app.UseRouting();

app.Run();