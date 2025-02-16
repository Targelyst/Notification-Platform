using NotificationPlatform.Exceptions;
using NotificationPlatform.Services;

namespace NotificationPlatform.Queries;

public record BulkAddEmailContactPropertiesResult(int InsertedEntries);

[MutationType]
public static class EmailContactMutations {

    [Error<NotFoundException>]
    [Error<InvalidPropertyValueSpecificationException>]
    public static async Task<BulkAddEmailContactPropertiesResult> BulkAddEmailContactPropertiesToContactsAsync(
        List<Guid> contactIds,
        List<BulkAddEmailContactPropertyDTO> contactProperties,
        EmailContactPropertyService ecpService
    ) {
        int insertedEntries = await ecpService.BulkAddEmailContactPropertiesToContactsAsync(
            contactIds,
            contactProperties
        );

        return new(insertedEntries);
    }

    [Error<NotFoundException>]
    [Error<InvalidPropertyValueSpecificationException>]
    public static async Task<BulkAddEmailContactPropertiesResult> BulkAddEmailContactPropertiesToSegmentAsync(
        Guid segmentId,
        List<BulkAddEmailContactPropertyDTO> contactProperties,
        EmailContactPropertyService ecpService
    ) {
        int insertedEntries = await ecpService.BulkAddEmailContactPropertiesToSegmentAsync(
            segmentId,
            contactProperties
        );

        return new(insertedEntries);
    }

}