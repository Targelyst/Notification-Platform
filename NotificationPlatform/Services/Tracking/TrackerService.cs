using MessagePack;
using Microsoft.Extensions.Options;
using NotificationPlatform.Configuration;

namespace NotificationPlatform.Services.Tracking;

public sealed class TrackerService(
    IOptions<TrackerConfiguration> configuration
) : IDisposable {

    private readonly Sbee sbee = new(Convert.FromHexString(configuration.Value.TokenKey));

    public string CreateTrackerUrl(TrackIdentifier identifier) {
        byte[] encodedIdentifier = MessagePackSerializer.Serialize(identifier);
        string encryptedIdentifier = this.sbee.Encode(encodedIdentifier);

        return encryptedIdentifier;
    }

    public void Dispose() {
        this.sbee.Dispose();
    }
}