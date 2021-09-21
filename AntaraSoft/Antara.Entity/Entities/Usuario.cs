using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public record Usuario
    {
        public long Id { get; set; }
        [Required(ErrorMessage = "Ingrese un correo electrónico")]
        [EmailAddress(ErrorMessage = "Correo electrónico no cumple con el formato")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Ingrese una contraseña")]
        [StringLength(18, ErrorMessage = "Debe tener entre 6 y 18 caracteres",MinimumLength = 6)]
        public string Password { get; set; }
        [Required(ErrorMessage = "Ingrese una nombre de perfil")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public char Gender { get; set; }
        [Required]
        public bool Active { get; set; }
        [Required]
        public DateTime RegistrationDate { get; set; }
        [Required(ErrorMessage = "Ingrese un país")]
        public string Country { get; set; }
    }
}
