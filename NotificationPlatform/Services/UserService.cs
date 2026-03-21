using Microsoft.Extensions.Options;
using NotificationPlatform.Configuration;

namespace NotificationPlatform.Services;

public interface IUserService {
    public string Tenant { get; }
}

public class UserInformationRetrievalException(
    string message
) : Exception(message) { }

public class DevelopmentUserService : IUserService {

    public string Tenant => "development-tenant";

}

public class UserService(
    IOptions<AuthConfiguration> configuration,
    IHttpContextAccessor httpContext
) : IUserService {

    public string Tenant {
        get {
            var context = httpContext.HttpContext
                ?? throw new UserInformationRetrievalException("HttpContext could not be retrieved");

            var tenant = context
                .User
                .Claims
                .FirstOrDefault(c => c.Type == configuration.Value.TenantClaim)?
                .Value
                ?? throw new UserInformationRetrievalException("User has no tenant claim");

            return tenant;
        }
    }

}