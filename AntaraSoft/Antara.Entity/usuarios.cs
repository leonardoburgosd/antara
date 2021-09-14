using System;

namespace Antara.Entity
{
    public class usuarios
    {
        public int id { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public DateTime birthDate { get; set; }
        public Boolean gender { get; set; }
        public Boolean active { get; set; }
        public string country { get; set; }
        public DateTime registrationDate { get; set; }
        public DateTime updateDate { get; set; }
        public DateTime deleteDate { get; set; }
    }
}
