using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public class Genero
    {
        public int id { get; set; }
        public string tipo { get; set; }
        public int padre { get; set; }
    }
}
