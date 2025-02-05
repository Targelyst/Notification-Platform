using System.ComponentModel.DataAnnotations;
using NotificationPlatform.Data;
using NotificationPlatform.Models.Email;
using NotificationPlatform.Services;

namespace NotificationPlatform.Queries;

[MutationType]
public static class EmailMutations {

    [UseProjection]
    public static async Task<IQueryable<EmailTransport>?> AddEmailTransportAsync(
        Guid emailConfigurationId,
        string host,
        int port,
        string user,
        string password,
        List<string>? senderAddresses,
        NotificationPlatformContext db,
        IUserService userService
    ) {
        var emailConfiguration = await db.EmailConfigurations.FindAsync(emailConfigurationId);

        if (emailConfiguration is null) {
            return null;
        }

        List<EmailTransportSenderAddress> newSenderAddresses = [];

        if (senderAddresses is not null) {
            newSenderAddresses = [..
                senderAddresses
                    .Select(a => new EmailTransportSenderAddress() {
                        Tenant = userService.Tenant,
                        Address = a,
                    })
            ];

        }

        EmailTransport newTransport = new() {
            Tenant = userService.Tenant,
            Host = host,
            Port = port,
            User = user,
            Password = password,
            SenderAddresses = newSenderAddresses
        };

        emailConfiguration.Transports.Add(newTransport);
        await db.SaveChangesAsync();

        return db.EmailTransports.Where(et => et.Id == newTransport.Id);
    }

    [UseProjection]
    public static async Task<IQueryable<EmailTransportSenderAddress>?> AddEmailTransportSenderAddressAsync(
        Guid emailTransportId,
        // TODO: Validate
        string address,
        NotificationPlatformContext db,
        IUserService userService
    ) {
        var emailTransport = await db.EmailTransports.FindAsync(emailTransportId);

        if (emailTransport is null) {
            return null;
        }

        EmailTransportSenderAddress newSender = new() {
            Tenant = userService.Tenant,
            Address = address
        };

        emailTransport.SenderAddresses.Add(newSender);
        await db.SaveChangesAsync();

        return db.EmailTransportSenderAddresses.Where(p => p.Id == newSender.Id);
    }

}