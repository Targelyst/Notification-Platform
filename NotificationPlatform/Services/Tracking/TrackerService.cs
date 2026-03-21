using MessagePack;
using Microsoft.Extensions.Options;
using NotificationPlatform.Configuration;

namespace NotificationPlatform.Services.Tracking;

public sealed class TrackerService(
    IOptions<TrackerConfiguration> configuration
) : IDisposable {

    private readonly Sbee sbee = new(Convert.FromHexString(configuration.Value.TokenKey));

    public string CreateTrackUrl(TrackIdentifier identifier) {
        string encodedIdentifier = this.encodeIdentifier(identifier);
        return $"{configuration.Value.ExternalBaseUrl}/track/{encodedIdentifier}";
    }

    public string CreateProxyUrl(ProxyIdentifier identifier) {
        string encodedIdentifier = this.encodeIdentifier(identifier);
        return $"{configuration.Value.ExternalBaseUrl}/proxy/{encodedIdentifier}";
    }

    public void Dispose() {
        this.sbee.Dispose();
    }

    private string encodeIdentifier(object identifier) {
        byte[] encodedIdentifier = MessagePackSerializer.Serialize(identifier);
        return this.sbee.Encode(encodedIdentifier);
    }

}