﻿namespace Ehospital.Server.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        //public string PasswordHash { get; set; }
        public DateTime RegisterDate { get; set; }
        public DateTime Birthdate { get; set; }
    }
}
