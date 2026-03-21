using MessagePack;

namespace NotificationPlatform.Services.Tracking;

[MessagePackObject]
public record TrackIdentifier(
    [property: Key("tenant")]
    string Tenant,
    [property: Key("contact")]
    string Contact
);

[MessagePackObject]
public record ProxyIdentifier(
    [property: Key("tenant")]
    string Tenant,
    [property: Key("contact")]
    string Contact,
    [property: Key("url")]
    string Url
);