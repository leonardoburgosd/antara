using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public class Audios
    {
        public long Id { get; set; }
        [Required(ErrorMessage = "Ingrese un nombre para el audio")]
        [StringLength(45, ErrorMessage = "Debe ser menor de 45 caracteres")]
        public string Name { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int CreationYear { get; set; }
        public string Interpreter { get; set; }
        public string Writer { get; set; }
        public string Producer { get; set; }
        public int Reproductions { get; set; }
        public long Genero_id { get; set; }
        public string Url { get; set; }
    }
}
