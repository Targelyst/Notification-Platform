namespace NotificationPlatform.Exceptions;

public class NotFoundException(string entity)
    : Exception($"The entity {entity} could not be found.");