using NotificationPlatform.Data;
using NotificationPlatform.Models;

namespace NotificationPlatform.Queries;

[QueryType]
public static class PartnerQueries {

    public static async Task<Partner?> GetPartnerByIdAsync(
        Guid id,
        NotificationPlatformContext db
    ) {
        return await db.Partners.FindAsync(id);
    }
}