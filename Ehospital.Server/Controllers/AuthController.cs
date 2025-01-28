using Ehospital.Server.Dtos;
using Ehospital.Server.Entities;
using Ehospital.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ehospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user == null)
            {
                return BadRequest("This Email already exists");
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public  async Task<ActionResult<TokenDto>> Login(UserDto request)
        {
            var token = await authService.LoginAsync(request);

            if (token == null) return BadRequest("invalid email or password");
                return Ok(token);
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var tokens = await authService.RefreshTokenAsync(request);
            if (tokens is null || tokens.AccessToken is null || tokens.RefreshToken is null) return Unauthorized("Invalid refresh token");
            return Ok(tokens);
        }

    }
}
