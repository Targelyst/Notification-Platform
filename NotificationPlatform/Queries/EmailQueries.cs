using System.Linq.Expressions;
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
    public static IQueryable<EmailSegment> GetEmailSegments(
        Guid emailConfigurationId,
        NotificationPlatformContext db
    ) => db.EmailSegments
            .Where(ec => ec.EmailConfigurationId == emailConfigurationId)
            .OrderBy(ec => ec.Id)
            .ThenBy(ec => ec.Id);

    [UsePaging]
    [UseProjection]
    public static async Task<IQueryable<EmailContact>> GetEmailContactsBySegmentAsync(
        Guid segmentId,
        ILoggerFactory loggerFactory,
        NotificationPlatformContext db
    ) {
        var logger = loggerFactory.CreateLogger("EmailQueries");

        var emailSegment = await db.EmailSegments
            .Where(es => es.Id == segmentId)
            .FirstOrDefaultAsync();

        if (emailSegment is null) {
            return Enumerable.Empty<EmailContact>().AsQueryable();
        }

        var availableProperties = await db.EmailContactProperties.ToListAsync();
        var segmentExpression = EmailSegmentExpression.FromJson(emailSegment.Expression);

        return db.EmailContacts
            .Where(segmentExpression.ToPredicate())
            .OrderBy(ec => ec.Id)
            .ThenBy(ec => ec.Id);
    }

}