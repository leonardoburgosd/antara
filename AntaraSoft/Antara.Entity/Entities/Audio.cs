using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public record Audio
    {
        public long Id { get; set; }
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
        public long Genero_id { get; set; }
        [Required]
        [StringLength(150)]
        public string Url { get; set; }
        public void AumentarReproduccion()
        {
            this.Reproductions += 1;
        }
    }
}
