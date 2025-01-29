using NotificationPlatform.Data;
using NotificationPlatform.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace NotificationPlatform.Controllers;

[ApiController]
[Route("api/partners")]
public class PartnerController(
    ILogger<PartnerController> logger,
    NotificationPlatformContext db
) : ControllerBase {

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Partner>>> GetPartners() {
        logger.LogInformation("Ok");
        return Ok(await db.Partners.ToListAsync());
    }

}