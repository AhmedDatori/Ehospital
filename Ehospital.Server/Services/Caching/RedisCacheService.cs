using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Ehospital.Server.Services.Caching
{
    public class RedisCacheService(IDistributedCache cache) : IRedisCacheService
    {

        public T? GetData<T>(string key)
        {
            var data = cache?.GetString(key);

            if (data == null)
            {
                return default(T);
            }
            return JsonSerializer.Deserialize<T>(data);
        }

        public void SetData<T>(string key, T value)
        {
            var options = new DistributedCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            };

            cache?.SetString(key, JsonSerializer.Serialize(value), options);
        }
        public void DeleteData(string key)
        {
            cache.Remove(key);
        }
    }
}
