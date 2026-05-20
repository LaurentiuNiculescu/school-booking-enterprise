using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolBookingEnterprise.Server.Models;
using SchoolBookingEnterprise.Server.Services;

namespace SchoolBookingEnterprise.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "SuperAdmin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly AuthService _authService;

    public AdminController(AdminService adminService, AuthService authService)
    {
        _adminService = adminService;
        _authService = authService;
    }

    [HttpGet("schools")]
    public async Task<IActionResult> GetSchools() => Ok(await _adminService.GetSchoolsAsync());

    [HttpPost("schools")]
    public async Task<IActionResult> CreateSchool([FromBody] School school) =>
        Ok(await _adminService.CreateSchoolAsync(school));

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers() => Ok(await _adminService.GetUsersAsync());

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest req)
    {
        var user = await _authService.CreateUserAsync(req.Email, req.Password, req.Name, req.Role, req.SchoolId);
        return Ok(new { id = user.Id, email = user.Email, name = user.Name, role = user.Role });
    }

    [HttpPut("users/{id}/reset")]
    public async Task<IActionResult> ResetUser(string id)
    {
        var ok = await _adminService.ResetUserAsync(id);
        return ok ? Ok(new { message = "User reset" }) : NotFound();
    }

    [HttpPut("users/{id}/toggle")]
    public async Task<IActionResult> ToggleUser(string id, [FromBody] ToggleRequest req)
    {
        var ok = await _adminService.ToggleUserActiveAsync(id, req.IsActive);
        return ok ? Ok(new { message = "User updated" }) : NotFound();
    }
}

public record CreateUserRequest(string Email, string Password, string Name, string Role, string? SchoolId);
public record ToggleRequest(bool IsActive);
