using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Data;
using NotificationPlatform.Exceptions;
using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Services;

public class BulkAddEmailContactPropertyDTO {

    public required Guid PropertyId { get; set; }
    public required string Value { get; set; }

}

public class InvalidPropertyValueSpecificationException()
    : Exception();


public class EmailContactPropertyService(
    IDbContextFactory<NotificationPlatformContext> dbFactory,
    IUserService userService
) : IAsyncDisposable {

    private readonly NotificationPlatformContext db = dbFactory.CreateDbContext();

    public async Task<int> BulkAddEmailContactPropertiesToContactsAsync(
        List<Guid> contactIds,
        List<BulkAddEmailContactPropertyDTO> contactProperties
    ) {
        var distinctContactIds = contactIds.Distinct();
        var distinctPropertyIds = contactProperties.Select(p => p.PropertyId).Distinct();

        var contactIdsAreValid = (
            await this.db.EmailContacts
                .Where(ec => contactIds.Contains(ec.Id) && ec.Tenant == userService.Tenant)
                .CountAsync()
            ) == distinctContactIds.Count();

        if (!contactIdsAreValid) throw new NotFoundException("EmailContact");

        var propertyIdsAreValid = (
            await this.db.EmailContactProperties
                .Where(ep => distinctPropertyIds.Contains(ep.Id) && ep.Tenant == userService.Tenant)
                .CountAsync()
            ) == distinctPropertyIds.Count();

        if (!propertyIdsAreValid) throw new NotFoundException("EmailContactProperty");

        var propertyTypes = await this.db.EmailContactProperties
            .ToDictionaryAsync(ecp => ecp.Id, ecp => ecp.Type);

        var propertyChoices = await this.db.EmailContactProperties
            .OfType<EmailContactChoiceProperty>()
            .ToDictionaryAsync(ecp => ecp.Id, ecp => ecp.Choices);

        var newPropertyValues = contactProperties
            .SelectMany(p =>
                contactIds.Select(c => new EmailContactPropertyValue {
                    Tenant = userService.Tenant,
                    ContactId = c,
                    PropertyId = p.PropertyId,
                    Value = p.Value
                })
            )
            .ToList();

        db.EmailContactPropertyValues.AddRange(newPropertyValues);

        await db.SaveChangesAsync();

        return newPropertyValues.Count;
    }

    public Task<int> BulkAddEmailContactPropertiesToSegmentAsync(
        Guid segmentId,
        List<BulkAddEmailContactPropertyDTO> contactProperties
    ) {
        // TODO: Get contacts from segment and call `BulkAddEmailContactPropertiesToContactsAsync` with it
        List<Guid> contacts = [];

        return this.BulkAddEmailContactPropertiesToContactsAsync(contacts, contactProperties);
    }

    public ValueTask DisposeAsync() {
        GC.SuppressFinalize(this);
        return this.db.DisposeAsync();
    }
}