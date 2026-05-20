using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SchoolBookingEnterprise.Server.Models;

public class CheckoutRecord
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string AssetId { get; set; } = string.Empty;

    public string AssetName { get; set; } = string.Empty;
    public string AssignedTo { get; set; } = string.Empty;
    public string CheckedOutBy { get; set; } = string.Empty;

    public DateTime CheckedOutAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReturnedAt { get; set; }
    public string? Notes { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string? SchoolId { get; set; }
}
