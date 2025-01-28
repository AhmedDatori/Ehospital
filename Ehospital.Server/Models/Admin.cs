﻿namespace Ehospital.Server.Models
{
    public class Admin
    {
        public Guid Id { get; set; }
        public Guid UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public string Email { get; set; }
        //public string PasswordHash { get; set; }
        public DateOnly Birthdate { get; set; }
    }
}
