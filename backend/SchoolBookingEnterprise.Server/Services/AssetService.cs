using MongoDB.Driver;
using SchoolBookingEnterprise.Server.Models;

namespace SchoolBookingEnterprise.Server.Services;

public class AssetService
{
    private readonly MongoDbService _db;

    public AssetService(MongoDbService db) => _db = db;

    public async Task<List<Asset>> GetAllAsync(string? schoolId = null)
    {
        var filter = schoolId != null
            ? Builders<Asset>.Filter.Eq(a => a.SchoolId, schoolId)
            : Builders<Asset>.Filter.Empty;
        return await _db.Assets.Find(filter).SortByDescending(a => a.CreatedAt).ToListAsync();
    }

    public async Task<Asset?> GetByIdAsync(string id) =>
        await _db.Assets.Find(a => a.Id == id).FirstOrDefaultAsync();

    public async Task<Asset?> GetByQrCodeAsync(string qrCode) =>
        await _db.Assets.Find(a => a.QrCode == qrCode).FirstOrDefaultAsync();

    public async Task<Asset> CreateAsync(Asset asset)
    {
        asset.QrCode = Guid.NewGuid().ToString("N")[..12].ToUpper();
        asset.CreatedAt = DateTime.UtcNow;
        asset.UpdatedAt = DateTime.UtcNow;
        await _db.Assets.InsertOneAsync(asset);
        return asset;
    }

    public async Task<bool> UpdateAsync(string id, Asset updated)
    {
        updated.Id = id;
        updated.UpdatedAt = DateTime.UtcNow;
        var result = await _db.Assets.ReplaceOneAsync(a => a.Id == id, updated);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _db.Assets.DeleteOneAsync(a => a.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<bool> CheckoutAsync(string assetId, string assignedTo, string userId, string userName)
    {
        var update = Builders<Asset>.Update
            .Set(a => a.Status, "checkedOut")
            .Set(a => a.AssignedTo, assignedTo)
            .Set(a => a.AssignedToUserId, userId)
            .Set(a => a.CheckedOutAt, DateTime.UtcNow)
            .Set(a => a.UpdatedAt, DateTime.UtcNow);

        var result = await _db.Assets.UpdateOneAsync(a => a.Id == assetId, update);
        if (result.ModifiedCount > 0)
        {
            var asset = await GetByIdAsync(assetId);
            await _db.CheckoutRecords.InsertOneAsync(new CheckoutRecord
            {
                AssetId = assetId,
                AssetName = asset?.Name ?? "",
                AssignedTo = assignedTo,
                CheckedOutBy = userName,
                SchoolId = asset?.SchoolId
            });
        }
        return result.ModifiedCount > 0;
    }

    public async Task<bool> CheckinAsync(string assetId)
    {
        var update = Builders<Asset>.Update
            .Set(a => a.Status, "available")
            .Set(a => a.AssignedTo, (string?)null)
            .Set(a => a.AssignedToUserId, (string?)null)
            .Set(a => a.CheckedOutAt, (DateTime?)null)
            .Set(a => a.UpdatedAt, DateTime.UtcNow);

        var result = await _db.Assets.UpdateOneAsync(a => a.Id == assetId, update);
        if (result.ModifiedCount > 0)
        {
            await _db.CheckoutRecords.UpdateOneAsync(
                r => r.AssetId == assetId && r.ReturnedAt == null,
                Builders<CheckoutRecord>.Update.Set(r => r.ReturnedAt, DateTime.UtcNow));
        }
        return result.ModifiedCount > 0;
    }
}
