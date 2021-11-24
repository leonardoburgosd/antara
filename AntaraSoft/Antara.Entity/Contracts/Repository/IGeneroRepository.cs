using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Repository
{
    public interface IGeneroRepository 
    {
        Task<List<Genero>> lista();
    }
}
