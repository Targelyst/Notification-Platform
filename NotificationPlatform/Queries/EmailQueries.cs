using Microsoft.EntityFrameworkCore;
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

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    public static async Task<IQueryable<EmailContact>> GetEmailContactsBySegmentAsync(
        Guid segmentId,
        ILoggerFactory loggerFactory,
        NotificationPlatformContext db
    ) {
        var logger = loggerFactory.CreateLogger("EmailQueries");
        logger.LogWarning("GetEmailContactsBySegmentAsync is not implemented yet. Returning dummy data.");

        var emailSegment = await db.EmailSegments
            .Where(es => es.Id == segmentId)
            .Include(es => es.EmailConfiguration)
            .FirstOrDefaultAsync();

        if (emailSegment is null) {
            return Enumerable.Empty<EmailContact>().AsQueryable();
        }

        return db.EmailContacts
            .Where(ec => ec.EmailConfigurationId == emailSegment.EmailConfigurationId)
            .OrderBy(ec => ec.Id)
            .ThenBy(ec => ec.Id);
    }

}