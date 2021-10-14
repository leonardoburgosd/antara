﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public record Pista
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int AnoCreacion { get; set; }
        public string Interprete { get; set; }
        public string Compositor { get; set; }
        public string Productor { get; set; }
        public int Reproducciones { get; set; }
        public int GeneroId { get; set; }
        public string Url { get; set; }
        public Guid UsuarioId { get; set; }
        public void AumentarReproduccion()
        {
            this.Reproducciones += 1;
        }
    }
}