namespace NotificationPlatform.Exceptions;

public class InvalidArgumentException(string message)
    : Exception(message);