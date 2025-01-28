namespace Ehospital.Server.Models
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public int PatientID { get; set; }
        public int DoctorID { get; set; }
        //public DateOnly Date { get; set; }
        //public TimeOnly Time { get; set; }
        //public string Status { get; set; }
    }
}
