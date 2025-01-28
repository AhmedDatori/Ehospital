namespace Ehospital.Server.DTOs
{
    public class AdminDTO
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateOnly Birthdate { get; set; }
    }
}
