using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NotificationPlatform.Migrations {
    /// <inheritdoc />
    public partial class Create_Event_Hypertables : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.Sql(@"
                SELECT create_hypertable('""TrackedEvents""', by_range('Time'));
            ");

            migrationBuilder.Sql(@"
                SELECT create_hypertable('""ProxiedEvents""', by_range('Time'));
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) { }
    }
}