namespace NotificationPlatform.Exceptions;

public class EmailSegmentExpressionValidationException()
    : Exception("The specified expression string is not a valid expression.") { }