using NotificationPlatform.Data;
using NotificationPlatform.Models;

namespace NotificationPlatform.Queries;

[MutationType]
public static class ProjectMutations {

    [UseProjection]
    public static async Task<IQueryable<Project>?> UpdateProjectAsync(
        Guid id,
        string name,
        NotificationPlatformContext db
    ) {
        var project = await db.Projects.FindAsync(id);

        if (project is null) {
            return null;
        }

        project.Name = name;

        await db.SaveChangesAsync();
        return db.Projects.Where(p => p.Id == id);
    }

}