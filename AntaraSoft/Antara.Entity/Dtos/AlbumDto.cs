using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Dtos
{
    public class AlbumDto
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaPublicacion { get; set; }
        public bool EstaPublicado { get; set; }
        public Guid UsuarioId { get; set; }
        public string Interprete { get; set; }
        public string PortadaUrl { get; set; }
        public bool EstaActivo { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}
