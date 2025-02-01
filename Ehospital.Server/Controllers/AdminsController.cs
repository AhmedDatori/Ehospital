using Ehospital.Server.Data;
using Ehospital.Server.Dtos;
using Ehospital.Server.Models;
using Ehospital.Server.Services;
using Ehospital.Server.Services.Caching;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ehospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController(AppDbContext context, IAuthService authService, IRedisCacheService cache) : ControllerBase
    {
        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetAdmin(Guid id)
        {
            // Redis cache
            var cacheKey = $"admin_{id}";

            var adminDto = cache.GetData<AdminDto>(cacheKey);

            if (adminDto == null)
            {
                var admin = await context.Admins.FindAsync(id);
                if (admin == null) return NotFound();

                var user = await context.Users.FindAsync(admin.UserID);
                if (user == null) return NotFound();

                adminDto = new AdminDto
                {
                    Id = admin.Id,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    Email = user.Email,
                    Password = null,
                    Birthdate = admin.Birthdate
                };

                cache.SetData(cacheKey, adminDto);
            }
            return Ok(adminDto);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("UserId/{userID}")]
        public async Task<ActionResult> GetAdminByUserID(Guid userID)
        {
            // Redis cache
            var cacheKey = $"admin_userId_{userID}";

            var adminDto = cache.GetData<AdminDto>(cacheKey);

            if (adminDto == null)
            {
                var admin = await context.Admins.FirstOrDefaultAsync(a => a.UserID == userID);
                if (admin == null) return NotFound();
                var user = await context.Users.FindAsync(admin.UserID);
                if (user == null) return NotFound();
                adminDto = new AdminDto
                {
                    Id = admin.Id,
                    FirstName = admin.FirstName,
                    LastName = admin.LastName,
                    Email = user.Email,
                    Password = null,
                    Birthdate = admin.Birthdate
                };
                cache.SetData(cacheKey, adminDto);
            }
            return Ok(adminDto);
        }

        //[Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult> AddAdmin(AdminDto admin)
        {
            var user = await authService.RegisterAsync(new UserDto
            {
                Email = admin.Email,
                Password = admin.Password,
                Role = "admin"
            });
            if (user == null)
            {
                return BadRequest("Error creating the user");
            }
            var newAdmin = new Admin
            {
                UserID = user.Id,
                FirstName = admin.FirstName,
                LastName = admin.LastName,
                Birthdate = admin.Birthdate
            };

            context.Admins.Add(newAdmin);
            await context.SaveChangesAsync();

            cache.DeleteData("admins");

            return Ok(newAdmin);
        }


        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAdmin(Guid id, AdminDto admin)
        {
            var adminToUpdate = await context.Admins.FindAsync(id);
            if (adminToUpdate == null) return NotFound();
            var updatedUser = await authService.UpdateUserAsync(adminToUpdate.UserID, new UserDto
            {
                Email = admin.Email,
                Password = admin.Password
            });
            if (updatedUser == null) return BadRequest("Error updating the user");

            adminToUpdate.FirstName = admin.FirstName;
            adminToUpdate.LastName = admin.LastName;
            adminToUpdate.Birthdate = admin.Birthdate;
            await context.SaveChangesAsync();
            cache.DeleteData("admins");
            cache.DeleteData("admin_" + id);
            cache.DeleteData("admin_userId_" + adminToUpdate.UserID);

            return Ok(adminToUpdate);
        }


        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAdmin(Guid id)
        {
            var admin = await context.Admins.FindAsync(id);
            if (admin == null) return NotFound();
            var user = await context.Users.FindAsync(admin.UserID);
            if (user == null) return NotFound();
            context.Users.Remove(user);
            context.Admins.Remove(admin);
            await context.SaveChangesAsync();
            cache.DeleteData("admins");
            return Ok();
        }


    } 
}
