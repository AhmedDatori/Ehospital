using Ehospital.Server.Data;
using Ehospital.Server.Services.Caching;
using Ehospital.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ehospital.Server.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Ehospital.Server.Models;
using System.Security.Claims;

namespace Ehospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController(AppDbContext context, IAuthService authService, IRedisCacheService cache) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult> GetDoctors(int? pageNumber = null, int? pageSize = null)
        {
            // Check Redis cache
            var cacheKey = $"doctors_page_{pageNumber}_size_{pageSize}";
            var doctors = cache.GetData<List<DoctorDto>>(cacheKey);

            if (doctors == null)
            {
                var query = context.Doctors.AsQueryable();

                // get the current page and items based on the page number and page size if exists
                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    query = query.Skip((pageNumber.Value - 1) * pageSize.Value)
                                 .Take(pageSize.Value);
                }

                var doctorssData = await query.ToListAsync();

                // Map to PatientDto 
                doctors = new List<DoctorDto>();
                foreach (var d in doctorssData)
                {
                    var user = await context.Users.FindAsync(d.UserID);
                    var Dspecialization = await context.Specializations.FirstOrDefaultAsync(spec=> spec.Id.ToString()== d.SpecializationID);
                    doctors.Add(new DoctorDto
                    {
                        Id = d.Id,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        Email = user?.Email?.ToString(),
                        Specialization = Dspecialization.Name,
                        Birthdate = d.Birthdate
                    });
                }

                cache.SetData(cacheKey, doctors);
            }

            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetDoctor(Guid id)
        {
            var currentUserRole = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            var currentUserID = HttpContext.User.FindFirstValue("userID");

            // redis
            var cacheKey = $"doctor_id_{id}";
            var doctor = cache.GetData<DoctorDto>(cacheKey);
            if (doctor == null)
            {

                doctor = await context.Doctors
                    .Where(d => d.Id == id)
                    .Select(d => new
                    {
                        Doctor = d,
                        User = context.Users.FirstOrDefault(u => u.Id == d.UserID),
                        Specialization = context.Specializations.FirstOrDefault(s => s.Id.ToString() == d.SpecializationID)
                    })
                    .Select(data => new DoctorDto
                    {
                        Id = data.Doctor.Id,
                        FirstName = data.Doctor.FirstName,
                        LastName = data.Doctor.LastName,
                        Email = data.User.Email,
                        Specialization = data.Specialization.Name,
                        Birthdate = data.Doctor.Birthdate
                    })
                    .FirstOrDefaultAsync();


                if (doctor == null)
                {
                    return NotFound("Doctor not found.");
                }

                cache.SetData(cacheKey, doctor);
            }

            return Ok(doctor);
        }

        [HttpGet("UserID/{UserID}")]
        public async Task<ActionResult> GetDoctorByUserID(Guid userID)
        {
            // Redis cache
            var cacheKey = $"doctor_userID_{userID}";
            var doctor = cache.GetData<DoctorDto>(cacheKey);

            if (doctor == null)
            {
                doctor = await context.Doctors
                    .Where(d => d.UserID == userID)
                    .Select(d => new {
                        Doctor = d,
                        User = context.Users.FirstOrDefault(u => u.Id == d.UserID),
                        Specialization = context.Specializations.FirstOrDefault(s => s.Id.ToString() == d.SpecializationID)
                    })
                    .Select(data => new DoctorDto
                    {
                        Id = data.Doctor.Id,
                        FirstName = data.Doctor.FirstName,
                        LastName = data.Doctor.LastName,
                        Email = data.User.Email,
                        Specialization = data.Specialization.Name,
                        Birthdate = data.Doctor.Birthdate
                    })
                    .FirstOrDefaultAsync();

                if (doctor == null)
                {
                    return NotFound("Doctor not found.");
                }

                cache.SetData(cacheKey, doctor);
            }

            return Ok(doctor);
        }


        //[Authorize(Roles= "admin")]
        [HttpPost]
        public async Task<ActionResult> AddDoctor(DoctorDto doctorDto)
        {
            var specialization = await context.Specializations
                .FirstOrDefaultAsync(s => s.Name == doctorDto.Specialization);

            if (specialization == null)
            {
                return BadRequest("Specialization not found.");
            }

            var user = await authService.RegisterAsync(new UserDto
            {
                Email = doctorDto.Email,
                Password = doctorDto.Password,
                Role = "doctor"
            });

            if (user == null)
            {
                return BadRequest("Email already exists.");
            }

            var newDoctor = new Doctor
            {
                FirstName = doctorDto.FirstName,
                LastName = doctorDto.LastName,
                UserID = user.Id,
                SpecializationID = specialization.Id.ToString(),
                Birthdate = doctorDto.Birthdate
            };

            context.Doctors.Add(newDoctor);
            await context.SaveChangesAsync();


            return Ok(new DoctorDto
            {
                Id= newDoctor.Id,
                FirstName = newDoctor.FirstName,
                LastName = newDoctor.LastName,
                Email = user.Email,
                Specialization = specialization.Name,
                Birthdate = newDoctor.Birthdate
            });
        }

        [Authorize(Roles = "admin,doctor")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateDoctor(Guid id, DoctorDto doctorDto)
        {
            var doctorToUpdate = await context.Doctors.FindAsync(id);
            if (doctorToUpdate == null)
            {
                return NotFound("Doctor not found.");
            }

            var specialization = await context.Specializations
                .FirstOrDefaultAsync(s => s.Name == doctorDto.Specialization);

            if (specialization == null)
            {
                return BadRequest("Specialization not found.");
            }

            var userToUpdate = await authService.UpdateUserAsync(doctorToUpdate.UserID, new UserDto
            {
                Email = doctorDto.Email,
                Password = doctorDto.Password,
                Role = "doctor"
            });

            if (userToUpdate == null)
            {
                return BadRequest("Error updating the user.");
            }

            doctorToUpdate.FirstName = doctorDto.FirstName;
            doctorToUpdate.LastName = doctorDto.LastName;
            doctorToUpdate.Birthdate = doctorDto.Birthdate;
            doctorToUpdate.SpecializationID = specialization.Id.ToString();
            await context.SaveChangesAsync();

            cache.DeleteData($"doctor_id_{id}");

            return Ok(new DoctorDto
            {
                Id = doctorToUpdate.Id,
                FirstName = doctorToUpdate.FirstName,
                LastName = doctorToUpdate.LastName,
                Email = doctorDto.Email,
                Specialization = specialization.Name,
                Birthdate = doctorToUpdate.Birthdate
            });
        }

        [Authorize(Roles = "admin,doctor")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDoctor(Guid id)
        {
            var doctorToDelete = await context.Doctors.FindAsync(id);
            if (doctorToDelete == null)
            {
                return NotFound("Doctor not found.");
            }

            var userToDelete = await context.Users.FindAsync(doctorToDelete.UserID);
            if (userToDelete == null)
            {
                return BadRequest("Error deleting the user.");
            }

            // Delete doctor's all appointments
            var appointmentsToDelete = await context.Appointments.Where(a => a.DoctorID == id).ToListAsync();
            if (appointmentsToDelete.Count > 0)
            {
                context.Appointments.RemoveRange(appointmentsToDelete);
            }

            context.Doctors.Remove(doctorToDelete);
            context.Users.Remove(userToDelete);
            await context.SaveChangesAsync();

            cache.DeleteData($"doctor_id_{id}");

            return Ok();
        }

    }
}
