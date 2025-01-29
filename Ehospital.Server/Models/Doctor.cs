namespace Ehospital.Server.Models
{
    public class Doctor
    {
        public Guid Id { get; set; }
        public Guid UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SpecializationID { get; set; }
        public DateOnly Birthdate { get; set; }
    }
}
