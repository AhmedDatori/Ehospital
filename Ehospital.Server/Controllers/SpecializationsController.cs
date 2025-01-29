using Ehospital.Server.Data;
using Ehospital.Server.Services.Caching;
using Ehospital.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ehospital.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Ehospital.Server.Dtos;

namespace Ehospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationsController(AppDbContext context, IAuthService authService, IRedisCacheService cache) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<List<Specialization>>> GetSpecializations()
        {
            // Redis cache
            var cachedSpecializations = cache.GetData<List<Specialization>>("Specializations");
            if (cachedSpecializations == null)
            {
                cachedSpecializations = await context.Specializations.ToListAsync();
                if (cachedSpecializations == null) return NotFound();
                cache.SetData("Specializations", cachedSpecializations);
            }
            return Ok(cachedSpecializations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Specialization>> GetSpecialization(Guid id)
        {
            // Redis cache
            var cacheKey = $"specialization_{id}";
            var specialization = cache.GetData<Specialization>(cacheKey);
            if (specialization == null)
            {
                specialization = await context.Specializations.FindAsync(id);
                if (specialization == null) return NotFound();
                cache.SetData(cacheKey, specialization);
            }
            return Ok(specialization);
        }

        //[Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<ActionResult> AddSpecialization(SpecializationDto newSpecialization)
        {
            if (newSpecialization.Name == null) return BadRequest();
            var specialization = new Specialization { Name = newSpecialization.Name };
            await context.Specializations.AddAsync(specialization);
            await context.SaveChangesAsync();

            // Redis cache
            cache.DeleteData("Specializations");

            return Ok(specialization);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSpecialization(Guid id, SpecializationDto updatedSpecialization)
        {
            var specialization = await context.Specializations.FindAsync(id);
            if (specialization == null) return NotFound();
            specialization.Name = updatedSpecialization.Name;
            await context.SaveChangesAsync();
            // Redis cache
            cache.DeleteData("Specializations");
            cache.DeleteData($"specialization_{id}");
            return Ok(specialization);
        }


        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpecialization(Guid id)
        {
            var specialization = await context.Specializations.FindAsync(id);
            if (specialization == null) return NotFound();
            context.Specializations.Remove(specialization);
            await context.SaveChangesAsync();
            // Redis cache
            cache.DeleteData("Specializations");
            cache.DeleteData($"specialization_{id}");
            return Ok();
        }
    }
}
