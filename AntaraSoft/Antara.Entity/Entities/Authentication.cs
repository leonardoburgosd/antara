using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public class Authentication
    {
        [Required(ErrorMessage = "Ingrese un correo electrónico")]
        [EmailAddress(ErrorMessage = "Correo electrónico no cumple con el formato")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string email { get; set; }
        [Required(ErrorMessage = "Ingrese una contraseña")]
        [StringLength(18, ErrorMessage = "Debe tener entre 6 y 18 caracteres", MinimumLength = 6)]
        public string password { get; set; }
    }
}
