using System.Globalization;

namespace NotificationPlatform.Data;

public static class EmailContactPropertyExtensions {

    public static string ToPropertyString(this DateOnly date) {
        return date.ToString("o", CultureInfo.InvariantCulture);
    }

}