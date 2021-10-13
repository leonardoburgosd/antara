using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Dtos
{
    public class AudioDto
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Ingrese un nombre para el audio")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        [Required]
        public DateTime RegistrationDate { get; set; }
        //[Range(1920,2021)]
        public int CreationYear { get; set; }
        [Required]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Interpreter { get; set; }
        public string Writer { get; set; }
        public string Producer { get; set; }
        public int Reproductions { get; set; }
        [Required]
        public int Genero_id { get; set; }
        [Required]
        [StringLength(150)]
        public string Url { get; set; }
        [Required]
        public Guid User_id { get; set; }
    }
}
