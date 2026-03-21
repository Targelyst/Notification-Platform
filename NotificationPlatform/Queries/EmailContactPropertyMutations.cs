using NotificationPlatform.Data;
using NotificationPlatform.Exceptions;
using NotificationPlatform.Models.Email;
using NotificationPlatform.Services;

namespace NotificationPlatform.Queries;

[MutationType]
public static class EmailContactPropertyMutations {

    [UseProjection]
    [Error<NotFoundException>]
    [Error<InvalidArgumentException>]
    public static async Task<IQueryable<EmailContactProperty>> AddEmailContactPropertyAsync(
        Guid emailConfigurationId,
        EmailContactPropertyType type,
        string name,
        bool? show,
        List<string>? choices,
        NotificationPlatformContext db,
        IUserService userService
    ) {
        var emailConfiguration = await db.EmailConfigurations.FindAsync(emailConfigurationId)
            ?? throw new NotFoundException("EmailConfiguration");

        if (type == EmailContactPropertyType.Choice && choices is null) {
            throw new InvalidArgumentException("If type == Choice, choices must be given.");
        }

        EmailContactProperty newProperty = type switch {
            EmailContactPropertyType.String => new EmailContactStringProperty {
                Tenant = userService.Tenant,
                Name = name,
            },
            EmailContactPropertyType.Number => new EmailContactNumberProperty {
                Tenant = userService.Tenant,
                Name = name,
            },
            EmailContactPropertyType.Choice => new EmailContactChoiceProperty {
                Tenant = userService.Tenant,
                Name = name,
                Choices = [.. choices ?? throw new InvalidOperationException()],
            },
            EmailContactPropertyType.Date => new EmailContactDateProperty {
                Tenant = userService.Tenant,
                Name = name,
            },
            _ => throw new NotImplementedException(),
        };

        if (show is bool s) {
            newProperty.Show = s;
        }

        emailConfiguration.Properties.Add(newProperty);
        await db.SaveChangesAsync();

        return db.EmailContactProperties.Where(ecp => ecp.Id == newProperty.Id);
    }

    [UseProjection]
    public static async Task<IQueryable<EmailContactProperty>> UpdateEmailContactPropertyAsync(
        Guid id,
        string name,
        bool? show,
        List<string>? choices,
        NotificationPlatformContext db
    ) {
        var emailContactProperty = await db.EmailContactProperties.FindAsync(id)
            ?? throw new NotFoundException("EmailContactProperty");

        if (emailContactProperty is EmailContactChoiceProperty ep) {
            if (choices is List<string> cs) {
                ep.Choices = [.. cs];
            } else {
                throw new InvalidArgumentException("Trying to update a Choice property, but no choices are given.");
            }
        }

        emailContactProperty.Name = name;

        if (show is bool s) {
            emailContactProperty.Show = s;
        }

        await db.SaveChangesAsync();

        return db.EmailContactProperties.Where(ecp => ecp.Id == emailContactProperty.Id);
    }

    [UseProjection]
    public static async Task<IQueryable<EmailContactProperty>> SetEmailContactPropertyShowAsync(
        Guid id,
        bool show,
        NotificationPlatformContext db
    ) {
        var emailContactProperty = await db.EmailContactProperties.FindAsync(id)
            ?? throw new NotFoundException("EmailContactProperty");

        emailContactProperty.Show = show;
        await db.SaveChangesAsync();

        return db.EmailContactProperties.Where(ecp => ecp.Id == emailContactProperty.Id);
    }

}