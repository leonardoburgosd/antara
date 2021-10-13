using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Dtos
{
    public class UpdateAudioDto
    {
        [Required(ErrorMessage = "Ingrese un nombre para el audio")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        [Range(1920,2021)]
        public int CreationYear { get; set; }
        [Required]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Interpreter { get; set; }
        public string Writer { get; set; }
        public string Producer { get; set; }
        [Required]
        public int Genero_id { get; set; }
        [Required]
        [StringLength(150)]
        public string Url { get; set; }
    }
}
