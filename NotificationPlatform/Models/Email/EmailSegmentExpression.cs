using System.Text.Json;
using System.Text.Json.Serialization;
using NotificationPlatform.Exceptions;

namespace NotificationPlatform.Models.Email;

public enum EmailSegmentExpressionOperator {
    And,
    Or,
    Not,
    Eq,
    NotEq,
    Lte,
    Lt,
    Gt,
    Gte,
    In,
    NotIn,
    Like,
    NotLike
}

[JsonPolymorphic(TypeDiscriminatorPropertyName = "typ")]
[JsonDerivedType(typeof(EmailSegmentOperationExpression), typeDiscriminator: "op")]
[JsonDerivedType(typeof(EmailSegmentLiteralExpression), typeDiscriminator: "lit")]
[JsonDerivedType(typeof(EmailSegmentVariableExpression), typeDiscriminator: "var")]
public abstract record EmailSegmentExpression {
    public static readonly JsonSerializerOptions JsonOptions = new();

    public override string ToString()
        => JsonSerializer.Serialize(this);

    public static EmailSegmentExpression FromString(string value)
        => JsonSerializer.Deserialize<EmailSegmentExpression>(value)
            ?? throw new JsonConversionNullException(typeof(EmailSegmentExpression));

    public static bool IsValidExpressionString(string value) {
        try {
            JsonSerializer.Deserialize<EmailSegmentExpression>(value);
            return true;
        } catch {
            return false;
        }
    }
}

public record EmailSegmentOperationExpression(
    [property: JsonPropertyName("op")]
    [property: JsonConverter(typeof(JsonStringEnumConverter))]
    EmailSegmentExpressionOperator Operator,

    [property: JsonPropertyName("expr")]
    List<EmailSegmentExpression> Expressions
) : EmailSegmentExpression;

public record EmailSegmentLiteralExpression(
    [property: JsonPropertyName("val")]
    object Value
) : EmailSegmentExpression;

public record EmailSegmentVariableExpression(
    [property: JsonPropertyName("var")]
    string Variable
) : EmailSegmentExpression;