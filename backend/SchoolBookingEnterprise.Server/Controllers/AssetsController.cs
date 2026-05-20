using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolBookingEnterprise.Server.Models;
using SchoolBookingEnterprise.Server.Services;
using System.Security.Claims;

namespace SchoolBookingEnterprise.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "Admin")]
public class AssetsController : ControllerBase
{
    private readonly AssetService _assetService;
    public AssetsController(AssetService assetService) => _assetService = assetService;

    private string? SchoolId => User.FindFirst("schoolId")?.Value;
    private string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
    private string UserName => User.FindFirst(ClaimTypes.Name)?.Value ?? "";
    private bool IsSuperAdmin => User.IsInRole("SuperAdmin");

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _assetService.GetAllAsync(IsSuperAdmin ? null : SchoolId));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var asset = await _assetService.GetByIdAsync(id);
        return asset == null ? NotFound() : Ok(asset);
    }

    [HttpGet("qr/{qrCode}")]
    public async Task<IActionResult> GetByQr(string qrCode)
    {
        var asset = await _assetService.GetByQrCodeAsync(qrCode);
        return asset == null ? NotFound() : Ok(asset);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Asset asset)
    {
        if (!IsSuperAdmin) asset.SchoolId = SchoolId;
        var created = await _assetService.CreateAsync(asset);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Asset asset)
    {
        var updated = await _assetService.UpdateAsync(id, asset);
        return updated ? Ok(asset) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _assetService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{id}/checkout")]
    public async Task<IActionResult> Checkout(string id, [FromBody] CheckoutRequest request)
    {
        var success = await _assetService.CheckoutAsync(id, request.AssignedTo, UserId, UserName);
        return success ? Ok(new { message = "Asset checked out" }) : BadRequest(new { message = "Could not check out asset" });
    }

    [HttpPost("{id}/checkin")]
    public async Task<IActionResult> Checkin(string id)
    {
        var success = await _assetService.CheckinAsync(id);
        return success ? Ok(new { message = "Asset checked in" }) : BadRequest(new { message = "Could not check in asset" });
    }
}

public record CheckoutRequest(string AssignedTo);
