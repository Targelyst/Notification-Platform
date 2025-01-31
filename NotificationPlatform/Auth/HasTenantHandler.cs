using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using NotificationPlatform.Configuration;

namespace NotificationPlatform.Auth;

public class HasTenantHandler(
    ILogger<HasTenantHandler> logger,
    IOptions<AuthConfiguration> configuration
) : AuthorizationHandler<HasTenantRequirement> {

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, HasTenantRequirement requirement
    ) {
        string? tenant = context
            .User
            .Claims
            .FirstOrDefault(c => c?.Type == configuration.Value.TenantClaim, null)?
            .Value;

        if (tenant is not null && tenant != string.Empty) {
            context.Succeed(requirement);
        } else {
            context.Fail(new AuthorizationFailureReason(
                this,
                $"User does not have the tenant claim '{configuration.Value.TenantClaim}'"
            ));
        }

        return Task.CompletedTask;
    }
}