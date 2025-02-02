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
                    EmailContactPropertyId = table.Column<Guid>(type: "uuid", nullable: true),
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
                    table.ForeignKey(
                        name: "FK_EmailContacts_EmailContactProperties_EmailContactPropertyId",
                        column: x => x.EmailContactPropertyId,
                        principalTable: "EmailContactProperties",
                        principalColumn: "Id");
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
                name: "IX_EmailContacts_EmailConfigurationId",
                table: "EmailContacts",
                column: "EmailConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailContacts_EmailContactPropertyId",
                table: "EmailContacts",
                column: "EmailContactPropertyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailContacts");

            migrationBuilder.DropTable(
                name: "EmailContactProperties");

            migrationBuilder.DropTable(
                name: "EmailConfigurations");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
