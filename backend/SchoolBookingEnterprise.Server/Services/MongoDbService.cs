using MongoDB.Driver;
using SchoolBookingEnterprise.Server.Models;

namespace SchoolBookingEnterprise.Server.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IMongoClient client, IConfiguration config)
    {
        _database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Asset> Assets => _database.GetCollection<Asset>("assets");
    public IMongoCollection<School> Schools => _database.GetCollection<School>("schools");
    public IMongoCollection<CheckoutRecord> CheckoutRecords => _database.GetCollection<CheckoutRecord>("checkoutRecords");
    public IMongoCollection<Alert> Alerts => _database.GetCollection<Alert>("alerts");
}
