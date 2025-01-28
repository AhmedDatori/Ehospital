namespace Ehospital.Server.DTOs
{
    public class DoctorDTO
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int SpecializationID { get; set; }
        public DateTime Birthdate { get; set; }
    }
}
