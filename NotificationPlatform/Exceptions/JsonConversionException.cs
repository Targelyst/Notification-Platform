namespace NotificationPlatform.Exceptions;

public class JsonConversionNullException(Type targetType) : Exception($"Result of seralizing {targetType} is null.") { }