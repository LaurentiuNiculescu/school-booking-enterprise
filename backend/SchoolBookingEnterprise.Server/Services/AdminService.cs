using MongoDB.Driver;
using SchoolBookingEnterprise.Server.Models;

namespace SchoolBookingEnterprise.Server.Services;

public class AdminService
{
    private readonly MongoDbService _db;

    public AdminService(MongoDbService db) => _db = db;

    public async Task<List<School>> GetSchoolsAsync() =>
        await _db.Schools.Find(_ => true).ToListAsync();

    public async Task<School> CreateSchoolAsync(School school)
    {
        school.CreatedAt = DateTime.UtcNow;
        await _db.Schools.InsertOneAsync(school);
        return school;
    }

    public async Task<List<User>> GetUsersAsync()
    {
        var projection = Builders<User>.Projection.Exclude(u => u.PasswordHash);
        return await _db.Users.Find(_ => true).Project<User>(projection).ToListAsync();
    }

    public async Task<bool> ResetUserAsync(string userId)
    {
        var update = Builders<User>.Update
            .Set(u => u.IsActive, true)
            .Set(u => u.LastLogin, (DateTime?)null);
        var result = await _db.Users.UpdateOneAsync(u => u.Id == userId, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> ToggleUserActiveAsync(string userId, bool isActive)
    {
        var result = await _db.Users.UpdateOneAsync(
            u => u.Id == userId,
            Builders<User>.Update.Set(u => u.IsActive, isActive));
        return result.ModifiedCount > 0;
    }
}
