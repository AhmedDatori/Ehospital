namespace Ehospital.Server.Dtos
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string Role { get; set; }
    }
}
