using NotificationPlatform.Models.Email;

using BinOps = NotificationPlatform.Models.Email.EmailSegmentExpressionBinaryOperator;
using BinOp = NotificationPlatform.Models.Email.EmailSegmentBinaryOperationExpression;
using LikeOp = NotificationPlatform.Models.Email.EmailSegmentLikeOperationExpression;
using Lit = NotificationPlatform.Models.Email.EmailSegmentLiteralExpression;
using CoVar = NotificationPlatform.Models.Email.EmailSegmentContactPropertyExpression;
using CuVar = NotificationPlatform.Models.Email.EmailSegmentCustomPropertyExpression;

namespace NotificationPlatform.Data;

public class DevelopmentSeeder {

    public static void Seed(NotificationPlatformContext db) {
        var testProjectId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var testProject = db.Projects.Find(testProjectId);

        EmailSegmentExpression testExpression = new BinOp(
            BinOps.Or,
            new BinOp(
                BinOps.Eq,
                new CoVar("EmailAddress"),
                new Lit(EmailContactPropertyType.String, "kp@mail.com")
            ),
            new LikeOp(
                true,
                "peter%",
                new CuVar("FirstName")
            )
        );

        if (testProject is null) {
            var result = db.Projects.Add(new() {
                Id = testProjectId,
                Name = "Test Project",
                Tenant = "development-tenant",
                EmailConfiguration = new() {
                    Tenant = "development-tenant",
                    Properties = [
                        new EmailContactStringProperty() {
                            Tenant = "development-tenant",
                            Name = "First Name"
                        },
                        new EmailContactStringProperty() {
                            Tenant = "development-tenant",
                            Name = "Last Name"
                        },
                        new EmailContactDateProperty() {
                            Tenant = "development-tenant",
                            Name = "Date of Birth"
                        },
                        new EmailContactChoiceProperty() {
                            Tenant = "development-tenant",
                            Name = "Birth Country",
                            Choices = ["Europe", "other"]
                        },
                    ],
                    Contacts = [
                        new () {
                            Tenant = "development-tenant",
                            EmailAddress = "example@mail.com"
                        },
                        new () {
                            Tenant = "development-tenant",
                            EmailAddress = "cool.user@mail.com"
                        }
                    ],
                    Segments = [
                        new() {
                            Tenant = "development-tenant",
                            Name = "Example Segment",
                            Expression = testExpression.ToJson()
                        }
                    ]
                }
            });

            if (result.Entity.EmailConfiguration is not null) {
                Random rng = new Random(0);

                foreach (var c in result.Entity.EmailConfiguration.Contacts) {
                    foreach (var p in result.Entity.EmailConfiguration.Properties) {
                        string value = p switch {
                            EmailContactStringProperty pp => Guid.NewGuid().ToString("n")[..8],
                            EmailContactNumberProperty pp => rng.NextDouble().ToString(),
                            EmailContactDateProperty pp => DateOnly.FromDayNumber((int)rng.NextInt64(0, DateOnly.MaxValue.DayNumber)).ToPropertyString(),
                            EmailContactChoiceProperty pp => pp.Choices[rng.NextInt64(0, pp.Choices.Length)],
                            _ => throw new NotImplementedException()
                        };

                        c.Properties.Add(new() {
                            Tenant = "development-tenant",
                            PropertyId = p.Id,
                            Value = value
                        });
                    }
                }
            }

            db.SaveChanges();
        }
    }

}