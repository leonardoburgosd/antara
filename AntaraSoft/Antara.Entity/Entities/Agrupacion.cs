using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Entities
{
    public class Agrupacion
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime PublicationDate { get; set; }
        public Boolean IsPublished { get; set; }
        public string Type { get; set; }
        public long Usuario_id { get; set; }
    }
}
