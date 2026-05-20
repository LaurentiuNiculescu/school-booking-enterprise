using MongoDB.Driver;
using SchoolBookingEnterprise.Server.Models;

namespace SchoolBookingEnterprise.Server.Services;

public class DashboardService
{
    private readonly MongoDbService _db;

    public DashboardService(MongoDbService db) => _db = db;

    public async Task<object> GetStatsAsync(string? schoolId = null)
    {
        var filter = schoolId != null
            ? Builders<Asset>.Filter.Eq(a => a.SchoolId, schoolId)
            : Builders<Asset>.Filter.Empty;

        var assets = await _db.Assets.Find(filter).ToListAsync();

        var alertFilter = schoolId != null
            ? Builders<Alert>.Filter.And(
                Builders<Alert>.Filter.Eq(a => a.IsResolved, false),
                Builders<Alert>.Filter.Eq(a => a.SchoolId, schoolId))
            : Builders<Alert>.Filter.Eq(a => a.IsResolved, false);

        var activeAlerts = await _db.Alerts.CountDocumentsAsync(alertFilter);

        return new
        {
            TotalAssets = assets.Count,
            Available = assets.Count(a => a.Status == "available"),
            CheckedOut = assets.Count(a => a.Status == "checkedOut"),
            UnderMaintenance = assets.Count(a => a.Status == "maintenance"),
            Lost = assets.Count(a => a.Status == "lost"),
            ActiveAlerts = activeAlerts
        };
    }
}
