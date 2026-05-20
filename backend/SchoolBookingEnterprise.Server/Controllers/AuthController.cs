using Microsoft.AspNetCore.Mvc;
using SchoolBookingEnterprise.Server.Services;

namespace SchoolBookingEnterprise.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (success, token, user) = await _authService.LoginAsync(request.Email, request.Password);
        if (!success) return Unauthorized(new { message = "Invalid email or password" });

        return Ok(new
        {
            token,
            user = new { id = user!.Id, email = user.Email, name = user.Name, role = user.Role, schoolId = user.SchoolId }
        });
    }
}

public record LoginRequest(string Email, string Password);
