namespace Ehospital.Server.Dtos
{
    public class AdminDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public DateOnly Birthdate { get; set; }
    }
}
