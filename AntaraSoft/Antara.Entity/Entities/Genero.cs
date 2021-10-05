using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public class Genero
    {
        public long Id { get; set; }
        public string Type { get; set; }
        public long Parent { get; set; }

    }
}
