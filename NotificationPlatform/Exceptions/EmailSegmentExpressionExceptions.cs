namespace NotificationPlatform.Exceptions;

public class InvalidSegmentExpressionException : Exception {

    private static readonly string message = "The specified expression string is not a valid expression.";

    public InvalidSegmentExpressionException() : base(message) { }
    public InvalidSegmentExpressionException(Exception innerException) : base(message, innerException) { }

}

public class ExpressionDeserializesToNullException()
    : Exception("The expression string deserializes to null.");

public class InvalidOperandException(string message)
    : Exception($"Invalid operand: {message}");