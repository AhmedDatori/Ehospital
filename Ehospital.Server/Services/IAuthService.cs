
using Ehospital.Server.Dtos;
using Ehospital.Server.Entities;

namespace Ehospital.Server.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserDto request);
        Task<TokenDto?> LoginAsync(UserDto request);

        Task<TokenDto?> RefreshTokenAsync(RefreshTokenRequestDto request);

        Task<User?> UpdateUserAsync(Guid id,UserDto request);
    }
}
