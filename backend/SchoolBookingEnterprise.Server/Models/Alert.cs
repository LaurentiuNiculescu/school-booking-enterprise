using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolBookingEnterprise.Server.Models;

public class Alert
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? AssetId { get; set; }

    public string AssetName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // overdue | maintenance | lost | damage
    public string Message { get; set; } = string.Empty;
    public bool IsResolved { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? SchoolId { get; set; }
}
