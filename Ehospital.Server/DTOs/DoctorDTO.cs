namespace Ehospital.Server.Dtos
{
    public class DoctorDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string Specialization { get; set; }
        public DateTime Birthdate { get; set; }
    }
}
