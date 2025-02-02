using NotificationPlatform.Models;
using NotificationPlatform.Models.Email;

namespace NotificationPlatform.Data;

public class DevelopmentSeeder {

    public static void Seed(NotificationPlatformContext db) {
        var testProjectId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var testProject = db.Projects.Find(testProjectId);

        if (testProject is null) {
            db.Projects.Add(new() {
                Id = testProjectId,
                Name = "Test Project",
                Tenant = "development-tenant",
                EmailConfiguration = new() {
                    Tenant = "development-tenant",
                    EmailContactProperties = [
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
                    ]
                }
            });

            db.SaveChanges();
        }
    }

}