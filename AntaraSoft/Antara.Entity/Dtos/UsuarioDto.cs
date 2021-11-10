﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Antara.Model.Dtos
{
    public class UsuarioDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public char Genero { get; set; }
        public DateTime FechaRegistro { get; set; }
        public string Pais { get; set; }
        public string FotoPerfil { get; set; }
    }
}
