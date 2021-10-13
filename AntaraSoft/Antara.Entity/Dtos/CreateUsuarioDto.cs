﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Dtos
{
    public class CreateUsuarioDto
    {
        [Required(ErrorMessage = "Ingrese un correo electrónico")]
        [RegularExpression("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$", ErrorMessage = "Correo electrónico no cumple con el formato")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Ingrese una contraseña")]
        [StringLength(18, ErrorMessage = "Debe tener entre 6 y 18 caracteres", MinimumLength = 6)]
        public string Password { get; set; }
        [Required(ErrorMessage = "Ingrese una nombre de perfil")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public char Gender { get; set; }
        [Required(ErrorMessage = "Ingrese un país")]
        public string Country { get; set; }
    }
}