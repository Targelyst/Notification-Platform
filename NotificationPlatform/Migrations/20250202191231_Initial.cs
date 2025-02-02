using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NotificationPlatform.Models.Email;

#nullable disable

namespace NotificationPlatform.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:email_contact_property_type", "choice,date,number,string");

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Tenant = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailConfigurations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Tenant = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailConfigurations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailConfigurations_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailContactProperties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<EmailContactPropertyType>(type: "email_contact_property_type", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Show = table.Column<bool>(type: "boolean", nullable: false),
                    EmailConfigurationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Choices = table.Column<string[]>(type: "text[]", nullable: true),
                    Tenant = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailContactProperties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailContactProperties_EmailConfigurations_EmailConfigurati~",
                        column: x => x.EmailConfigurationId,
                        principalTable: "EmailConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailContacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EmailAddress = table.Column<string>(type: "text", nullable: false),
                    EmailConfigurationId = table.Column<Guid>(type: "uuid", nullable: true),
                    Tenant = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailContacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailContacts_EmailConfigurations_EmailConfigurationId",
                        column: x => x.EmailConfigurationId,
                        principalTable: "EmailConfigurations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EmailContactPropertyValues",
                columns: table => new
                {
                    ContactId = table.Column<Guid>(type: "uuid", nullable: false),
                    PropertyId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<EmailContactPropertyType>(type: "email_contact_property_type", nullable: false),
                    EmailContactChoicePropertyValue_Value = table.Column<string>(type: "text", nullable: true),
                    EmailContactDatePropertyValue_Value = table.Column<DateOnly>(type: "date", nullable: true),
                    Value = table.Column<double>(type: "double precision", nullable: true),
                    EmailContactStringPropertyValue_Value = table.Column<string>(type: "text", nullable: true),
                    Tenant = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailContactPropertyValues", x => new { x.ContactId, x.PropertyId });
                    table.ForeignKey(
                        name: "FK_EmailContactPropertyValues_EmailContactProperties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "EmailContactProperties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmailContactPropertyValues_EmailContacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "EmailContacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailConfigurations_ProjectId",
                table: "EmailConfigurations",
                column: "ProjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmailContactProperties_EmailConfigurationId",
                table: "EmailContactProperties",
                column: "EmailConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailContactProperties_Type_Name",
                table: "EmailContactProperties",
                columns: new[] { "Type", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmailContactPropertyValues_PropertyId",
                table: "EmailContactPropertyValues",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailContacts_EmailConfigurationId",
                table: "EmailContacts",
                column: "EmailConfigurationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailContactPropertyValues");

            migrationBuilder.DropTable(
                name: "EmailContactProperties");

            migrationBuilder.DropTable(
                name: "EmailContacts");

            migrationBuilder.DropTable(
                name: "EmailConfigurations");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
