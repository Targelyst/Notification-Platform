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
        [GraphQLType<ListType<EmailAddressType>>]
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
        [GraphQLType<EmailAddressType>]
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

    [UseProjection]
    public static async Task<IQueryable<EmailTransport>?> UpdateEmailTransportAsync(
        Guid id,
        string host,
        int port,
        string user,
        string? password,
        NotificationPlatformContext db
    ) {
        var emailTransport = await db.EmailTransports.FindAsync(id);

        if (emailTransport is null) {
            return null;
        }

        emailTransport.Host = host;
        emailTransport.Port = port;
        emailTransport.User = user;

        if (password is not null) {
            emailTransport.Password = password;
        }

        await db.SaveChangesAsync();

        return db.EmailTransports.Where(et => et.Id == id);
    }

    [UseProjection]
    public static async Task<IQueryable<EmailTransportSenderAddress>?> UpdateEmailTransportSenderAddressAsync(
        Guid id,
        [GraphQLType<EmailAddressType>]
        string address,
        NotificationPlatformContext db
    ) {
        var emailTransportSenderAddress = await db.EmailTransportSenderAddresses.FindAsync(id);

        if (emailTransportSenderAddress is null) {
            return null;
        }

        emailTransportSenderAddress.Address = address;
        await db.SaveChangesAsync();

        return db.EmailTransportSenderAddresses.Where(a => a.Id == id);
    }

    [UseMutationConvention(Disable = true)]
    public static async Task<Guid?> DeleteEmailTransportAsync(
        Guid id,
        NotificationPlatformContext db
    ) {
        var emailTransport = await db.EmailTransports.FindAsync(id);

        if (emailTransport is null) {
            return null;
        }

        db.Remove(emailTransport);
        await db.SaveChangesAsync();

        return id;
    }

    [UseMutationConvention(Disable = true)]
    public static async Task<Guid?> DeleteEmailTransportSenderAddressAsync(
        Guid id,
        NotificationPlatformContext db
    ) {
        var emailTransportSenderAddress = await db.EmailTransportSenderAddresses.FindAsync(id);

        if (emailTransportSenderAddress is null) {
            return null;
        }

        db.Remove(emailTransportSenderAddress);
        await db.SaveChangesAsync();

        return id;
    }

}