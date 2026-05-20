using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SchoolBookingEnterprise.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SchoolBookingEnterprise.Server.Services;

public class AuthService
{
    private readonly MongoDbService _db;
    private readonly IConfiguration _config;

    public AuthService(MongoDbService db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<(bool Success, string Token, User? User)> LoginAsync(string email, string password)
    {
        var user = await _db.Users.Find(u => u.Email == email && u.IsActive).FirstOrDefaultAsync();
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return (false, string.Empty, null);

        await _db.Users.UpdateOneAsync(
            u => u.Id == user.Id,
            Builders<User>.Update.Set(u => u.LastLogin, DateTime.UtcNow));

        return (true, GenerateToken(user), user);
    }

    public async Task<User> CreateUserAsync(string email, string password, string name, string role, string? schoolId = null)
    {
        var user = new User
        {
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Name = name,
            Role = role,
            SchoolId = schoolId
        };
        await _db.Users.InsertOneAsync(user);
        return user;
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id!),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("schoolId", user.SchoolId ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
