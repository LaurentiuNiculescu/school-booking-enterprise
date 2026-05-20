using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolBookingEnterprise.Server.Services;

namespace SchoolBookingEnterprise.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;
    public DashboardController(DashboardService dashboardService) => _dashboardService = dashboardService;

    private string? SchoolId => User.FindFirst("schoolId")?.Value;
    private bool IsSuperAdmin => User.IsInRole("SuperAdmin");

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() =>
        Ok(await _dashboardService.GetStatsAsync(IsSuperAdmin ? null : SchoolId));
}
