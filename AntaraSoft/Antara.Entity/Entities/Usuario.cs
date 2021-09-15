using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public record Usuario
    {
        public long Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public char Gender { get; set; }
        public bool Active { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string Country { get; set; }
    }
}
