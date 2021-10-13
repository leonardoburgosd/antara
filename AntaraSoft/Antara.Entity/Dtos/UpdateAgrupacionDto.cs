using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Dtos
{
    public class UpdateAgrupacionDto
    {
        [Required(ErrorMessage = "Ingrese un nombre para el audio")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        [StringLength(150, ErrorMessage = "Debe ser menor de 150 caracteres")]
        public string Description { get; set; }
        [Required]
        public bool IsPublished { get; set; }
        [Required]
        public string Type { get; set; }
    }
}
