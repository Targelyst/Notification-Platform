using System.Data;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using NotificationPlatform.Data;
using NotificationPlatform.Exceptions;

namespace NotificationPlatform.Models.Email;

public enum EmailSegmentExpressionBinaryOperator {
    And,
    Or,
    Eq,
    NotEq,
    Lte,
    Lt,
    Gt,
    Gte
}

public enum EmailSegmentExpressionUnaryOperator {
    Not
}

public record EmailSegmentExpressionContext(
    ParameterExpression Entity,
    List<EmailContactProperty> AvailableProperties
);

[JsonPolymorphic(TypeDiscriminatorPropertyName = "typ")]
[JsonDerivedType(typeof(EmailSegmentBinaryOperationExpression), typeDiscriminator: "bop")]
[JsonDerivedType(typeof(EmailSegmentUnaryOperationExpression), typeDiscriminator: "uop")]
[JsonDerivedType(typeof(EmailSegmentLiteralExpression), typeDiscriminator: "lit")]
[JsonDerivedType(typeof(EmailSegmentLikeOperationExpression), typeDiscriminator: "lik")]
[JsonDerivedType(typeof(EmailSegmentConvertExpression), typeDiscriminator: "con")]
[JsonDerivedType(typeof(EmailSegmentContactPropertyExpression), typeDiscriminator: "covar")]
[JsonDerivedType(typeof(EmailSegmentCustomPropertyExpression), typeDiscriminator: "cuvar")]
public abstract record EmailSegmentExpression {

    public static readonly JsonSerializerOptions JsonOptions = new() {
        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
    };

    public abstract Expression ToExpression(ParameterExpression entity);

    public Expression<Func<EmailContact, bool>> ToPredicate() {
        var parameter = Expression.Parameter(typeof(EmailContact), "x");

        return Expression.Lambda<Func<EmailContact, bool>>(
            this.ToExpression(parameter),
            parameter
        );
    }

    public string ToJson()
        => JsonSerializer.Serialize(this, JsonOptions);

    public static EmailSegmentExpression FromJson(string value)
        => JsonSerializer.Deserialize<EmailSegmentExpression>(value, JsonOptions)
            ?? throw new ExpressionDeserializesToNullException();

    public static void ValidateExpressionString(string expression) {
        try {
            var expressionParsed = FromJson(expression);
            var _ = expressionParsed.ToPredicate();
        } catch (Exception e) {
            throw new InvalidSegmentExpressionException(e);
        }
    }

}

public record EmailSegmentBinaryOperationExpression(
    [property: JsonPropertyName("op")]
    [property: JsonConverter(typeof(JsonStringEnumConverter))]
    EmailSegmentExpressionBinaryOperator Operator,

    [property: JsonPropertyName("expr1")]
    EmailSegmentExpression Expr1,

    [property: JsonPropertyName("expr2")]
    EmailSegmentExpression Expr2
) : EmailSegmentExpression {

    public override Expression ToExpression(ParameterExpression entity) {
        var cexp1 = Expr1.ToExpression(entity);
        var cexp2 = Expr2.ToExpression(entity);

        return Operator switch {
            EmailSegmentExpressionBinaryOperator.And => Expression.AndAlso(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.Or => Expression.OrElse(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.Eq => Expression.Equal(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.NotEq => Expression.NotEqual(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.Lte => Expression.LessThanOrEqual(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.Lt => Expression.LessThan(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.Gt => Expression.GreaterThan(cexp1, cexp2),
            EmailSegmentExpressionBinaryOperator.Gte => Expression.GreaterThanOrEqual(cexp1, cexp2),
            _ => throw new NotImplementedException(),
        };
    }

};

public record EmailSegmentUnaryOperationExpression(
    [property: JsonPropertyName("op")]
    [property: JsonConverter(typeof(JsonStringEnumConverter))]
    EmailSegmentExpressionUnaryOperator Operator,

    [property: JsonPropertyName("expr")]
    EmailSegmentExpression Expr
) : EmailSegmentExpression {

    public override Expression ToExpression(ParameterExpression entity) {
        var cexp = Expr.ToExpression(entity);

        return Operator switch {
            EmailSegmentExpressionUnaryOperator.Not => Expression.Not(cexp),
            _ => throw new NotImplementedException(),
        };
    }

};

public record EmailSegmentLikeOperationExpression(
    [property: JsonPropertyName("ci")]
    bool CaseInsensitive,

    [property: JsonPropertyName("pat")]
    string Pattern,

    [property: JsonPropertyName("expr")]
    EmailSegmentExpression Expr
) : EmailSegmentExpression {

    public override Expression ToExpression(ParameterExpression entity) {
        var cexp = Expr.ToExpression(entity);

        Expression<Func<string>> patternSelector = () => this.Pattern;

        Type fnProvider;
        string fn;

        if (CaseInsensitive) {
            fnProvider = typeof(NpgsqlDbFunctionsExtensions);
            fn = nameof(NpgsqlDbFunctionsExtensions.ILike);
        } else {
            fnProvider = typeof(DbFunctionsExtensions);
            fn = nameof(DbFunctionsExtensions.Like);
        }

        return Expression.Call(fnProvider, fn, null, Expression.Constant(EF.Functions), cexp, patternSelector.Body);
    }

};

public record EmailSegmentLiteralExpression(
    [property: JsonPropertyName("type")]
    [property: JsonConverter(typeof(JsonStringEnumConverter))]
    EmailContactPropertyType TargetType,

    [property: JsonPropertyName("val")]
    string Value
) : EmailSegmentExpression {

    public override Expression ToExpression(ParameterExpression entity) {

        if (TargetType == EmailContactPropertyType.Date) {
            Expression<Func<string>> dateSelector = () => Value;

            return Expression.Call(
                typeof(NpgsqlDbFunctionsExtensions),
                nameof(NpgsqlDbFunctionsExtensions.ToDate),
                null,
                Expression.Constant(EF.Functions),
                dateSelector.Body,
                Expression.Constant("YYYY-MM-DD")
            );
        }

        object convertedValue = TargetType switch {
            EmailContactPropertyType.String => Value,
            EmailContactPropertyType.Number => double.Parse(Value),
            EmailContactPropertyType.Choice => Value,
            _ => throw new NotImplementedException(),
        };

        Expression<Func<object>> valueSelector = () => convertedValue;

        return valueSelector.Body;
    }

}

public record EmailSegmentConvertExpression(
    [property: JsonPropertyName("to")]
    [property: JsonConverter(typeof(JsonStringEnumConverter))]
    EmailContactPropertyType TargetType,

    [property: JsonPropertyName("expr")]
    EmailSegmentExpression Expr
) : EmailSegmentExpression {

    public override Expression ToExpression(ParameterExpression entity) {
        var cexp = Expr.ToExpression(entity);

        if (TargetType == EmailContactPropertyType.Date) {
            return Expression.Call(
                typeof(NpgsqlDbFunctionsExtensions),
                nameof(NpgsqlDbFunctionsExtensions.ToDate),
                null,
                Expression.Constant(EF.Functions),
                cexp,
                Expression.Constant("YYYY-MM-DD")
            );
        }

        Type targetType = TargetType switch {
            EmailContactPropertyType.String => typeof(string),
            EmailContactPropertyType.Number => typeof(double),
            EmailContactPropertyType.Choice => typeof(string),
            _ => throw new NotImplementedException(),
        };

        return Expression.Convert(cexp, targetType);
    }

}


public record EmailSegmentContactPropertyExpression(
    [property: JsonPropertyName("var")]
    string Variable
) : EmailSegmentExpression {

    private static readonly HashSet<string> allowedProperties = ["Id", "EmailAddress", "CreatedAt"];

    public override Expression ToExpression(ParameterExpression entity) {
        if (!allowedProperties.Contains(Variable)) {
            throw new InvalidOperationException($"Variable '{Variable}' is not an allowed variable name.");
        }

        return Expression.PropertyOrField(entity, Variable);
    }

}

public record EmailSegmentCustomPropertyExpression(
    [property: JsonPropertyName("var")]
    string Variable
) : EmailSegmentExpression {

    public override Expression ToExpression(ParameterExpression entity) {
        var propertiesAccess = Expression.PropertyOrField(entity, "Properties");

        var propertyParameter = Expression.Parameter(typeof(EmailContactPropertyValue), "p");
        var propertyDefAccess = Expression.Property(propertyParameter, "Property");
        var propertyNameAccess = Expression.Property(propertyDefAccess, "Name");
        Expression<Func<object>> propertyNameSelector = () => Variable;

        var wherePredicate = Expression.Lambda(
            Expression.Equal(propertyNameAccess, propertyNameSelector.Body),
            propertyParameter
        );

        var firstPropertyExpression = Expression.Call(
            typeof(Enumerable),
            "FirstOrDefault",
            [typeof(EmailContactPropertyValue)],
            Expression.Call(
                typeof(Enumerable),
                "Where",
                [typeof(EmailContactPropertyValue)],
                propertiesAccess,
                wherePredicate
            )
        );

        return Expression.Property(
            firstPropertyExpression,
            "Value"
        );
    }

}