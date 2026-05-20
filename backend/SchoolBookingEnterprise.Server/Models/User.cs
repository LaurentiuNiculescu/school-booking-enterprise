using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolBookingEnterprise.Server.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "Admin"; // "Admin" | "SuperAdmin"

    [BsonRepresentation(BsonType.ObjectId)]
    public string? SchoolId { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLogin { get; set; }
}
