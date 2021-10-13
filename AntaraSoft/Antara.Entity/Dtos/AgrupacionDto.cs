using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Dtos
{
    public class AgrupacionDto
    {
        [Required]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Ingrese un nombre para el audio")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        [StringLength(150, ErrorMessage = "Debe ser menor de 150 caracteres")]
        public string Description { get; set; }
        public DateTime PublicationDate { get; set; }
        [Required]
        public bool IsPublished { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public Guid User_id { get; set; }
    }
}
