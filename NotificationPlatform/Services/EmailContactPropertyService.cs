using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Data;
using NotificationPlatform.Exceptions;
using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Services;

public class BulkAddEmailContactPropertyDTO {

    public required Guid PropertyId { get; set; }
    public required EmailContactPropertyValueInnerDTO PropertyValue { get; set; }

}

[OneOf]
public class EmailContactPropertyValueInnerDTO {

    public string? StringValue { get; set; }
    public double? NumberValue { get; set; }
    public string? ChoiceValue { get; set; }
    public DateOnly? DateValue { get; set; }

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
            .SelectMany<BulkAddEmailContactPropertyDTO, EmailContactPropertyValue>(p => {
                if (
                    p.PropertyValue.StringValue is not null
                    && propertyTypes[p.PropertyId] == EmailContactPropertyType.String
                ) {
                    return contactIds.Select(c => new EmailContactStringPropertyValue {
                        Tenant = userService.Tenant,
                        ContactId = c,
                        PropertyId = p.PropertyId,
                        Value = p.PropertyValue.StringValue
                    });
                }

                if (
                    p.PropertyValue.NumberValue is not null
                    && propertyTypes[p.PropertyId] == EmailContactPropertyType.Number
                ) {
                    return contactIds.Select(c => new EmailContactNumberPropertyValue {
                        Tenant = userService.Tenant,
                        ContactId = c,
                        PropertyId = p.PropertyId,
                        Value = (double)p.PropertyValue.NumberValue
                    });
                }

                if (
                    p.PropertyValue.ChoiceValue is not null
                    && propertyTypes[p.PropertyId] == EmailContactPropertyType.Choice
                    && propertyChoices[p.PropertyId].Contains(p.PropertyValue.ChoiceValue)
                ) {
                    return contactIds.Select(c => new EmailContactChoicePropertyValue {
                        Tenant = userService.Tenant,
                        ContactId = c,
                        PropertyId = p.PropertyId,
                        Value = p.PropertyValue.ChoiceValue
                    });
                }

                if (
                    p.PropertyValue.DateValue is not null
                    && propertyTypes[p.PropertyId] == EmailContactPropertyType.Date
                ) {
                    return contactIds.Select(c => new EmailContactDatePropertyValue {
                        Tenant = userService.Tenant,
                        ContactId = c,
                        PropertyId = p.PropertyId,
                        Value = (DateOnly)p.PropertyValue.DateValue
                    });
                }

                throw new InvalidPropertyValueSpecificationException();
            })
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