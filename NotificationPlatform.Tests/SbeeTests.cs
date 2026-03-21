using NotificationPlatform.Services.Tracking;

namespace NotificationPlatform.Tests;

public class SbeeTests {

    [Fact]
    public void SerializeBasicSbeeMessage() {
        var key = new byte[32];
        using var sbee = new Sbee(key);

        var message = new byte[] { 1, 2, 3, 4 };
        var token = sbee.Encode(message);
        Assert.NotEmpty(token);

        var decrypted = sbee.Decode(token);
        Assert.Equal(message, decrypted);
    }

}