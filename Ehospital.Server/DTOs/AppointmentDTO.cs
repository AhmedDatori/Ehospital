namespace Ehospital.Server.Dtos
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }
        public string DoctorName { get; set; }
        public Guid DoctorID { get; set; }
        public string SpecialityName { get; set; }
        public string PatientName { get; set; }
        public Guid PatientID { get; set; }
        
    }
}
