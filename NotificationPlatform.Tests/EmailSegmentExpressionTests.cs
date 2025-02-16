using System.Text.Json;
using NotificationPlatform.Models.Email;

using Ops = NotificationPlatform.Models.Email.EmailSegmentExpressionOperator;
using Op = NotificationPlatform.Models.Email.EmailSegmentOperationExpression;
using Lit = NotificationPlatform.Models.Email.EmailSegmentLiteralExpression;
using Var = NotificationPlatform.Models.Email.EmailSegmentVariableExpression;

namespace NotificationPlatform.Tests;

public class EmailSegmentExpressionTests {

    [Fact]
    public void SerializesBasicExpressionToJson() {
        EmailSegmentExpression expression = new Op(
            Ops.Or,
            [
                new Op(
                    Ops.Eq,
                    [
                        new Var("x"),
                        new Lit("Example")
                    ]
                ),
                new Op(
                    Ops.Like,
                    [
                        new Var("y"),
                        new Lit("123%")
                    ]
                )
            ]
        );

        string serialized = JsonSerializer.Serialize(expression);

        Assert.Equal("{\"typ\":\"op\",\"op\":\"Or\",\"expr\":[{\"typ\":\"op\",\"op\":\"Eq\",\"expr\":[{\"typ\":\"var\",\"var\":\"x\"},{\"typ\":\"lit\",\"val\":\"Example\"}]},{\"typ\":\"op\",\"op\":\"Like\",\"expr\":[{\"typ\":\"var\",\"var\":\"y\"},{\"typ\":\"lit\",\"val\":\"123%\"}]}]}", serialized);
    }

    [Fact]
    public void DeserializeBasicExpressionFromJson() {
        string expressionJson = "{\"typ\":\"op\",\"op\":\"Or\",\"expr\":[{\"typ\":\"op\",\"op\":\"Eq\",\"expr\":[{\"typ\":\"var\",\"var\":\"x\"},{\"typ\":\"lit\",\"val\":\"Example\"}]},{\"typ\":\"op\",\"op\":\"Like\",\"expr\":[{\"typ\":\"var\",\"var\":\"y\"},{\"typ\":\"lit\",\"val\":\"123%\"}]}]}";

        var serialized = JsonSerializer.Deserialize<EmailSegmentExpression>(expressionJson);

        Console.WriteLine(serialized);

        // Assert.Equal(new Op(Ops.And, []), serialized);
    }

}