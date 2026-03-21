using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Data;
using NotificationPlatform.Exceptions;
using NotificationPlatform.Models.Email;
using NotificationPlatform.Services.Tracking;

namespace NotificationPlatform.Queries;

public record UrlResult(string Url);

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

    [Error<NotFoundException>]
    public static async Task<UrlResult> GetTrackLinkAsync(
        Guid emailContactId,
        NotificationPlatformContext db,
        TrackerService trackerService
    ) {
        var emailContact = await db.EmailContacts
            .FindAsync(emailContactId)
            ?? throw new NotFoundException(nameof(EmailContact));

        TrackIdentifier identifier = new(emailContact.Tenant, emailContact.Id.ToString());
        return new(trackerService.CreateTrackUrl(identifier));
    }

    [Error<NotFoundException>]
    public static async Task<UrlResult> GetProxyLinkAsync(
        Guid emailContactId,
        string url,
        NotificationPlatformContext db,
        TrackerService trackerService
    ) {
        var emailContact = await db.EmailContacts
            .FindAsync(emailContactId)
            ?? throw new NotFoundException(nameof(EmailContact));

        ProxyIdentifier identifier = new(emailContact.Tenant, emailContact.Id.ToString(), url);
        return new(trackerService.CreateProxyUrl(identifier));
    }

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