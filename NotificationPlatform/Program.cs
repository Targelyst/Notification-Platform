using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NotificationPlatform.Auth;
using NotificationPlatform.Configuration;
using NotificationPlatform.Data;
using NotificationPlatform.Models.Email;
using NotificationPlatform.Services;
using NotificationPlatform.Services.Tracking;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions<DatabaseConfiguration>()
  .Bind(builder.Configuration.GetSection(DatabaseConfiguration.Section))
  .ValidateDataAnnotations()
  .ValidateOnStart();

builder.Services.AddOptions<AuthConfiguration>()
  .Bind(builder.Configuration.GetSection(AuthConfiguration.Section))
  .ValidateDataAnnotations()
  .ValidateOnStart();

builder.Services.AddOptions<SecurityConfiguration>()
  .Bind(builder.Configuration.GetSection(SecurityConfiguration.Section))
  .ValidateDataAnnotations()
  .ValidateOnStart();

builder.Services.AddOptions<TrackerConfiguration>()
  .Bind(builder.Configuration.GetSection(TrackerConfiguration.Section))
  .ValidateDataAnnotations()
  .ValidateOnStart();

builder.Services.AddDbContextFactory<NotificationPlatformContext>(opt => {
    var c = builder.Configuration.GetSection(DatabaseConfiguration.Section).Get<DatabaseConfiguration>()
      ?? throw new Exception($"Could not get configuration section {DatabaseConfiguration.Section}");

    opt.UseNpgsql(
        $"Host={c.Host};Port={c.Port};Database={c.Database};Username={c.User};Password={c.Password}",
        opt => {
            opt.MapEnum<EmailContactPropertyType>();
        }
    );

    if (builder.Environment.IsDevelopment()) {
        opt.EnableSensitiveDataLogging();
    }
});

builder.Services
    .AddHttpContextAccessor()
    .AddScoped<IAuthorizationHandler, HasTenantHandler>()
    .AddScoped<EmailContactPropertyService>()
    .AddSingleton<ICryptographyService, CryptographyServiceAES>()
    .AddSingleton<TrackerService>()
    .AddCors(options => {
        options.AddDefaultPolicy(policy => {
            var origins = builder.Configuration
                .GetSection(WebConfiguration.Section)
                .Get<WebConfiguration>()?
                .CorsOrigins
                ?? throw new Exception(
                    $"Could not get configuration section {WebConfiguration.Section}"
                );

            policy
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithOrigins(origins);
            // TODO: Restrict headers?
            // .WithHeaders(HeaderNames.Authorization, HeaderNames.ContentType);
        });
    });

if (!builder.Environment.IsDevelopment()) {
    builder.Services
        .AddScoped<IUserService, UserService>()
        .AddAuthentication()
        .AddJwtBearer("TENANTS", options => {
            var c = builder.Configuration.GetSection(AuthConfiguration.Section).Get<AuthConfiguration>()
                ?? throw new Exception($"Could not get configuration section {AuthConfiguration.Section}");

            options.RequireHttpsMetadata = false;
            options.MetadataAddress = c.MetadataAddress;

            options.TokenValidationParameters = new TokenValidationParameters {
                ValidAudience = c.Audience,
            };
        });

    builder.Services.AddAuthorization(opts => {
        var tenantsAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder("TENANTS")
            .AddRequirements(new HasTenantRequirement())
            .RequireAuthenticatedUser();

        opts.DefaultPolicy = tenantsAuthorizationPolicyBuilder.Build();
        opts.FallbackPolicy = opts.DefaultPolicy;
    });
} else {
    builder.Services.AddScoped<IUserService, DevelopmentUserService>();
}

builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .AddMutationConventions(applyToAllMutations: true)
    .RegisterDbContextFactory<NotificationPlatformContext>()
    .AddTypes()
    .AddType<EmailContactStringProperty>()
    .AddType<EmailContactNumberProperty>()
    .AddType<EmailContactDateProperty>()
    .AddType<EmailContactChoiceProperty>()
    .ModifyRequestOptions(
        opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment()
    )
    .ModifyPagingOptions(
        opt => {
            opt.IncludeTotalCount = true;
            opt.MaxPageSize = 100;
        }
    )
    .ModifyCostOptions(
        opt => {
            opt.MaxFieldCost = 6000;
        }
    )
    .ModifyOptions(
        opt => {
            opt.EnableOneOf = true;
        }
    );

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment()) {
    app.UseSeeding();
} else {
    app.UseAuthentication();
    app.UseAuthorization();
}

app.MapGraphQL();

app.RunWithGraphQLCommands(args);