using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Data;

public class DevelopmentSeeder {

    public static void Seed(NotificationPlatformContext db) {
        var testProjectId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var testProject = db.Projects.Find(testProjectId);

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
                    ]
                }
            });

            if (result.Entity.EmailConfiguration is not null) {
                Random rng = new Random(0);

                foreach (var c in result.Entity.EmailConfiguration.Contacts) {
                    foreach (var p in result.Entity.EmailConfiguration.Properties) {
                        EmailContactPropertyValue value = p switch {
                            EmailContactStringProperty pp => new EmailContactStringPropertyValue() {
                                Tenant = "development-tenant",
                                PropertyId = pp.Id,
                                Value = Guid.NewGuid().ToString("n")[..8]
                            },
                            EmailContactNumberProperty pp => new EmailContactNumberPropertyValue() {
                                Tenant = "development-tenant",
                                PropertyId = pp.Id,
                                Value = rng.NextDouble()
                            },
                            EmailContactDateProperty pp => new EmailContactDatePropertyValue() {
                                Tenant = "development-tenant",
                                PropertyId = pp.Id,
                                Value = DateOnly.FromDayNumber((int)rng.NextInt64(0, DateOnly.MaxValue.DayNumber))
                            },
                            EmailContactChoiceProperty pp => new EmailContactChoicePropertyValue() {
                                Tenant = "development-tenant",
                                PropertyId = pp.Id,
                                Value = pp.Choices[rng.NextInt64(0, pp.Choices.Length)]
                            },
                            _ => throw new NotImplementedException()
                        };

                        c.Properties.Add(value);
                    }
                }
            }

            db.SaveChanges();
        }
    }

}