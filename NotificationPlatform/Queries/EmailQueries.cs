using NotificationPlatform.Data;
using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Queries;

[QueryType]
public static class EmailQueries {

    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<EmailConfiguration> GetEmailConfiguration(
        Guid id,
        NotificationPlatformContext db
    ) => db.EmailConfigurations.Where(ec => ec.Id == id);

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    public static IQueryable<EmailContact> GetEmailContacts(
        Guid emailConfigurationId,
        NotificationPlatformContext db
    ) => db.EmailContacts
            .Where(ec => ec.EmailConfigurationId == emailConfigurationId)
            .OrderBy(ec => ec.Id)
            .ThenBy(ec => ec.Id);

}