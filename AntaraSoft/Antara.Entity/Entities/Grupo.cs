using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public record Grupo
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaPublicacion { get; set; }
        public bool EstaPublicado { get; set; }
        public string Tipo { get; set; }
        public Guid UsuarioId { get; set; }
        public void PublicarGrupo()
        {
            EstaPublicado = true;
            FechaPublicacion = DateTime.Now;
        }
    }
}
