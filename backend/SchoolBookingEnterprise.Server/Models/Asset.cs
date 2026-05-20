using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolBookingEnterprise.Server.Models;

public class Asset
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Laptop | Projector | Tablet | Desktop | Camera | Other
    public string SerialNumber { get; set; } = string.Empty;
    public string QrCode { get; set; } = string.Empty; // Auto-generated unique identifier

    public string Status { get; set; } = "available"; // available | checkedOut | maintenance | lost

    public string? AssignedTo { get; set; }
    public string? AssignedToUserId { get; set; }
    public DateTime? CheckedOutAt { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? SchoolId { get; set; }

    public string? Location { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
