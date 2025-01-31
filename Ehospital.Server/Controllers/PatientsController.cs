using Ehospital.Server.Data;
using Ehospital.Server.Services.Caching;
using Ehospital.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ehospital.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Ehospital.Server.Entities;
using Ehospital.Server.Models;

namespace Ehospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController(AppDbContext context, IAuthService authService, IRedisCacheService cache) : ControllerBase
    {

        [Authorize(Roles = "admin,doctor")]
        [HttpGet]
        public async Task<ActionResult> GetPatients(int? pageNumber = null, int? pageSize = null)
        {
            // Check Redis cache
            var cacheKey = $"patients_page_{pageNumber}_size_{pageSize}";
            var patients = cache.GetData<List<PatientDto>>(cacheKey);

            if (patients == null)
            {
                var query = context.Patients.AsQueryable();

                // get the current page and items based on the page number and page size if exists
                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    query = query.Skip((pageNumber.Value - 1) * pageSize.Value)
                                 .Take(pageSize.Value);
                }

                var patientsData = await query.ToListAsync();

                // Map to PatientDto 
                patients = new List<PatientDto>();
                foreach (var p in patientsData)
                {
                    var user = await context.Users.FindAsync(p.UserID);
                    patients.Add(new PatientDto
                    {
                        Id = p.Id,
                        FirstName = p.FirstName,
                        LastName = p.LastName,
                        Email = user?.Email?.ToString(),
                        Password = null,
                        RegisterDate = p.RegisterDate,
                        Birthdate = p.Birthdate
                    });
                }

                cache.SetData(cacheKey, patients);
            }

            return Ok(patients);
        }

        [Authorize]
        [HttpGet("UserID/{userID}")]
        public async Task<ActionResult> GetPatientByUserID(Guid userID)
        {
            var currentUserRole = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            var currentUserID = HttpContext.User.FindFirstValue("userID");

            // Allow only admins, doctors and the patient himself to access
            if (currentUserRole == "patient" && currentUserID != userID.ToString())
            {
                return Unauthorized("You are not authorized to access this information.");
            }

            // Redis cache
            var cacheKey = $"patient_userID_{userID}";
            var patient = cache.GetData<PatientDto>(cacheKey);

            if (patient == null)
            {

                patient = await context.Patients
                    .Where(p => p.UserID == userID)
                    .Join(context.Users,
                        p => p.UserID,
                        u => u.Id,
                        (p, u) => new PatientDto
                        {
                            Id = p.Id,
                            FirstName = p.FirstName,
                            LastName = p.LastName,
                            Email = u.Email,
                            Password = null,
                            RegisterDate = p.RegisterDate,
                            Birthdate = p.Birthdate
                        })
                    .FirstOrDefaultAsync();

                if (patient == null)
                {
                    return NotFound("Patient not found.");
                }

                cache.SetData(cacheKey, patient);
            }

            return Ok(patient);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPatient(Guid id)
        {
            var currentUserRole = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            var currentUserID = HttpContext.User.FindFirstValue("userID");

            // redis
            var cacheKey = $"patient_id_{id}";
            var patient = cache.GetData<PatientDto>(cacheKey);
            if (patient == null)
            {

                patient = await context.Patients
                    .Where(p=>p.Id==id)
                    .Join(context.Users,
                        p => p.UserID,
                        u => u.Id,
                        (p, u) => new PatientDto
                        {
                            Id = p.Id,
                            FirstName = p.FirstName,
                            LastName = p.LastName,
                            Email = u.Email,
                            Password = null,
                            RegisterDate = p.RegisterDate,
                            Birthdate = p.Birthdate
                        })
                    .FirstOrDefaultAsync();

                if (patient == null)
                {
                    return NotFound("Patient not found.");
                }

                cache.SetData(cacheKey, patient);
            }

            return Ok(patient);
        }


        [HttpPost]
        public async Task<ActionResult> AddPatient(PatientDto patient)
        {
            var user = await authService.RegisterAsync(new UserDto
            {
                Email = patient.Email,
                Password = patient.Password,
                Role = "patient"
            });
            if (user == null)
            {
                return BadRequest("Email already exists.");
            }
            var newPatient = new Patient
            {
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                RegisterDate = patient.RegisterDate,
                Birthdate = patient.Birthdate,
                UserID = user.Id
            };
            context.Patients.Add(newPatient);
            await context.SaveChangesAsync();
            return Ok(newPatient);
        }


        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePatient(Guid id, PatientDto patient)
        {
            var currentUserRole = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            var currentUserID = HttpContext.User.FindFirstValue("userID");

            var patientToUpdate = await context.Patients.FindAsync(id);
            if (patientToUpdate == null)
            {
                return NotFound("Patient not found.");
            }

            // Allow only admins, doctors and the patient himself to update
            if (currentUserRole == "patient" && currentUserID != patientToUpdate.UserID.ToString())
            {
                return Unauthorized("You are not authorized to update this information.");
            }
            var userToUpdate = await authService.UpdateUserAsync(patientToUpdate.UserID, new UserDto
            {
                Email = patient.Email,
                Password = patient.Password,
                Role = "patient"

            });
            if (userToUpdate == null)
            {
                return BadRequest("Error updating the user.");
            }
            patientToUpdate.FirstName = patient.FirstName;
            patientToUpdate.LastName = patient.LastName;
            patientToUpdate.Birthdate = patient.Birthdate;
            await context.SaveChangesAsync();

            var p = new PatientDto
            {
                Id = patientToUpdate.Id,
                FirstName = patientToUpdate.FirstName,
                LastName = patientToUpdate.LastName,
                Birthdate = patientToUpdate.Birthdate,
                Email = userToUpdate.Email,
                Password = null,
                RegisterDate = patient.RegisterDate
            };
            // Delete cache
            cache.DeleteData($"patient_id_{id}");

            return Ok(p);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePatient(Guid id)
        {
            var currentUserRole = HttpContext.User.FindFirstValue(ClaimTypes.Role);
            var currentUserID = HttpContext.User.FindFirstValue("userID");


            var patientToDelete = await context.Patients.FindAsync(id);
            if (patientToDelete == null)
            {
                return NotFound("Patient not found.");
            }


            // Allow only admins, doctors and the patient himself to delete
            if (currentUserRole == "patient" && currentUserID != patientToDelete.UserID.ToString())
            {
                return Unauthorized("You are not authorized to delete this information.");
            }

            

            var userToDelete = await context.Users.FindAsync(patientToDelete.UserID);
            if (userToDelete == null)
            {
                return BadRequest("Error deleting the user.");
            }

            // Delete patient's all appointments
            var appointmentsToDelete = await context.Appointments.Where(a => a.PatientID == id).ToListAsync();
            if (appointmentsToDelete.Count > 0)
            {
                context.Appointments.RemoveRange(appointmentsToDelete);
            }

            context.Patients.Remove(patientToDelete);
            context.Users.Remove(userToDelete);
            await context.SaveChangesAsync();
            // Delete cache
            cache.DeleteData($"patient_id_{id}");
            return Ok(patientToDelete);
        }

    }
}
