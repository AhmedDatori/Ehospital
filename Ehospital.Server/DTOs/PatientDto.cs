﻿namespace Ehospital.Server.Dtos
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public DateOnly RegisterDate { get; set; }
        public DateOnly Birthdate { get; set; }
    }
}
