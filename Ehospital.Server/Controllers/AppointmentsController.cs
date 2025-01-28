using Ehospital.Server.Data;
using Ehospital.Server.Services.Caching;
using Ehospital.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ehospital.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Ehospital.Server.Dtos;

namespace Ehospital.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController(AppDbContext context, IAuthService authService, IRedisCacheService cache) : ControllerBase
    {

        [Authorize(Roles = "admin,doctor")]
        [HttpGet]
        public async Task<ActionResult<List<AppointmentDto>>> GetAppointments(int? pageNumber = null, int? pageSize = null)
        {
            var cacheKey = $"Appointments_page_{pageNumber}_size_{pageSize}";
            var cachedData = cache.GetData<List<AppointmentDto>>(cacheKey);
            if (cachedData != null)
            {
                return Ok(cachedData);
            }

            var query = from appointment in context.Appointments
                        join doctor in context.Doctors on appointment.DoctorID equals doctor.Id
                        join specialization in context.Specializations on doctor.SpecializationID equals specialization.Id
                        join patient in context.Patients on appointment.PatientID equals patient.Id
                        select new AppointmentDto
                        {
                            Id = appointment.Id,
                            DoctorID = doctor.Id,
                            DoctorName = doctor.FirstName + " " + doctor.LastName,
                            SpecialityName = specialization.Name,
                            PatientName = patient.FirstName + " " + patient.LastName,
                            PatientID = patient.Id
                        };

            if (pageNumber.HasValue && pageSize.HasValue)
            {
                query = query.Skip((pageNumber.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            var appointmentsData = await query.ToListAsync();

            // Caching the data
            cache.SetData(cacheKey, appointmentsData);
            return Ok(appointmentsData);
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointmentById(Guid id)
        {
            var appointmentQuery = from appointment in context.Appointments
                                   where appointment.Id == id
                                   join doctor in context.Doctors on appointment.DoctorID equals doctor.Id
                                   join specialization in context.Specializations on doctor.SpecializationID equals specialization.Id
                                   join patient in context.Patients on appointment.PatientID equals patient.Id
                                   select new AppointmentDto
                                   {
                                       Id = appointment.Id,
                                       DoctorName = doctor.FirstName + " " + doctor.LastName,
                                       DoctorID = doctor.Id,
                                       SpecialityName = specialization.Name,
                                       PatientName = patient.FirstName + " " + patient.LastName,
                                       PatientID = patient.Id
                                   };

            var appointmentDto = await appointmentQuery.FirstOrDefaultAsync();
            if (appointmentDto == null)
            {
                return NotFound(new { Message = "Appointment not found." });
            }

            return Ok(appointmentDto);
        }


        [Authorize]
        [HttpGet("UserID/{userId}")]
        public async Task<ActionResult<List<AppointmentDto>>> GetAllAppointmentsByUserID(Guid userId)
        {
            var cacheKey = $"Appointments_UserID_{userId}";
            var cachedData = cache.GetData<List<AppointmentDto>>(cacheKey);
            if (cachedData != null)
            {
                return Ok(cachedData);
            }

            var query = from appointment in context.Appointments
                        join doctor in context.Doctors on appointment.DoctorID equals doctor.Id
                        join specialization in context.Specializations on doctor.SpecializationID equals specialization.Id
                        join patient in context.Patients on appointment.PatientID equals patient.Id
                        where (doctor.UserID == userId || patient.UserID == userId)
                        select new AppointmentDto
                        {
                            Id = appointment.Id,
                            DoctorID = doctor.Id,
                            DoctorName = doctor.FirstName + " " + doctor.LastName,
                            SpecialityName = specialization.Name,
                            PatientName = patient.FirstName + " " + patient.LastName,
                            PatientID = patient.Id
                        };

            var appointmentsData = await query.ToListAsync();

            // Caching the data
            cache.SetData(cacheKey, appointmentsData);
            return Ok(appointmentsData);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAppointment(Guid id)
        {
            var appointment = await context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { Message = "Appointment not found." });
            }

            context.Appointments.Remove(appointment);
            await context.SaveChangesAsync();
;

            return Ok(new { Message = "Appointment deleted successfully." });
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Appointment>> AddAppointment(Appointment newAppointment)
        {
            if (newAppointment == null)
            {
                return BadRequest(new { Message = "Invalid appointment data." });
            }

            var doctor = await context.Doctors.AnyAsync(d => d.Id == newAppointment.DoctorID);
            var patient = await context.Patients.AnyAsync(p => p.Id == newAppointment.PatientID);
            if (!doctor || !patient)
            {
                return BadRequest(new { Message = "Doctor or patient not found." });
            }

            // Add to the database
            context.Appointments.Add(newAppointment);
            
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAppointmentById), new { id = newAppointment.Id }, newAppointment);
        }
    }
}
