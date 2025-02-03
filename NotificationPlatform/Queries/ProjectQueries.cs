using NotificationPlatform.Data;
using NotificationPlatform.Models;

namespace NotificationPlatform.Queries;

[QueryType]
public static class ProjectQueries {

    [UseProjection]
    [UseFiltering]
    public static IQueryable<Project> GetProjects(
        NotificationPlatformContext db
    ) => db.Projects;

    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Project> GetProject(
        Guid id,
        NotificationPlatformContext db
    ) => db.Projects.Where(p => p.Id == id);

}