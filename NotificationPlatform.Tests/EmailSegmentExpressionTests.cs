using System.Text.Json;
using NotificationPlatform.Models.Email;

using BinOps = NotificationPlatform.Models.Email.EmailSegmentExpressionBinaryOperator;
using UnOps = NotificationPlatform.Models.Email.EmailSegmentExpressionUnaryOperator;
using BinOp = NotificationPlatform.Models.Email.EmailSegmentBinaryOperationExpression;
using UnOp = NotificationPlatform.Models.Email.EmailSegmentUnaryOperationExpression;
using Lit = NotificationPlatform.Models.Email.EmailSegmentLiteralExpression;
using CoVar = NotificationPlatform.Models.Email.EmailSegmentContactPropertyExpression;
using CuVar = NotificationPlatform.Models.Email.EmailSegmentCustomPropertyExpression;
using System.Linq.Expressions;

namespace NotificationPlatform.Tests;

public class EmailSegmentExpressionTests {

    // [Fact]
    // public void SerializesBasicExpressionToJson() {
    //     EmailSegmentExpression expression = new MulOp(
    //         MulOps.Or,
    //         [
    //             new BinOp(
    //                 BinOps.Eq,
    //                 new Var("x"),
    //                 new Lit("Example")
    //             ),
    //             new BinOp(
    //                 BinOps.Gte,
    //                 new Var("y"),
    //                 new Lit(500)
    //             )
    //         ]
    //     );
    //
    //     string serialized = JsonSerializer.Serialize(expression);
    //
    //     Assert.Equal("{\"typ\":\"op\",\"op\":\"Or\",\"expr\":[{\"typ\":\"op\",\"op\":\"Eq\",\"expr\":[{\"typ\":\"var\",\"var\":\"x\"},{\"typ\":\"lit\",\"val\":\"Example\"}]},{\"typ\":\"op\",\"op\":\"Like\",\"expr\":[{\"typ\":\"var\",\"var\":\"y\"},{\"typ\":\"lit\",\"val\":\"123%\"}]}]}", serialized);
    // }
    //
    // [Fact]
    // public void DeserializeBasicExpressionFromJson() {
    //     string expressionJson = "{\"typ\":\"op\",\"op\":\"Or\",\"expr\":[{\"typ\":\"op\",\"op\":\"Eq\",\"expr\":[{\"typ\":\"var\",\"var\":\"x\"},{\"typ\":\"lit\",\"val\":\"Example\"}]},{\"typ\":\"op\",\"op\":\"Like\",\"expr\":[{\"typ\":\"var\",\"var\":\"y\"},{\"typ\":\"lit\",\"val\":\"123%\"}]}]}";
    //
    //     var serialized = JsonSerializer.Deserialize<EmailSegmentExpression>(expressionJson);
    //
    //     Console.WriteLine(serialized);
    //
    //     // Assert.Equal(new Op(Ops.And, []), serialized);
    // }

    // [Fact]
    // public void GenerateToExpressionTopLevel() {
    //     EmailSegmentExpression expression = new BinOp(
    //         BinOps.Or,
    //         new BinOp(
    //             BinOps.Eq,
    //             new Var("EmailAddress"),
    //             new Lit("kp@mail.com")
    //         ),
    //         new BinOp(
    //             BinOps.NotEq,
    //             new Var("EmailAddress"),
    //             new Lit("other@mail.com")
    //         )
    //     );
    //
    //     var result = expression.BuildExpressionString();
    //     Console.WriteLine(result);
    //
    //     // TODO: Meaningful assertions
    // }
    //
    // [Fact]
    // public void GenerateToPredicateTopLevel() {
    //     EmailSegmentExpression expression = new BinOp(
    //         BinOps.Or,
    //         new BinOp(
    //             BinOps.Eq,
    //             new Var("EmailAddress"),
    //             new Lit("kp@mail.com")
    //         ),
    //         new BinOp(
    //             BinOps.NotEq,
    //             new Var("EmailAddress"),
    //             new Lit("other@mail.com")
    //         )
    //     );
    //
    //     Console.WriteLine(expression.ToJson());
    //
    //     var result = expression.BuildExpressionString();
    //     Console.WriteLine(result);
    //
    //     // Assert.Equal(reference, result);
    // }
    //
    // [Fact]
    // public void GenerateToPredicatePropertyLevel() {
    //     EmailSegmentExpression expression = new BinOp(
    //         BinOps.Or,
    //         new BinOp(
    //             BinOps.Eq,
    //             new Var("EmailAddress"),
    //             new Lit("kp@mail.com")
    //         ),
    //         new BinOp(
    //             BinOps.NotEq,
    //             new Var("Properties.FirstName"),
    //             new Lit("Peter")
    //         )
    //     );
    //
    //     Console.WriteLine(expression.ToJson());
    //
    //     var result = expression.BuildExpressionString();
    //
    //     Console.WriteLine(result);
    //
    //     // TODO: Meaningful assertions
    // }

}