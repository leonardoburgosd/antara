using Antara.Model.Contracts.Repository;
using Antara.Model.Entities;
using Antara.Repository.Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Repository.Repositories
{
    public class GeneroRepository : IGeneroRepository
    {
        private readonly IDapper _dapper;
        public GeneroRepository(IDapper dapper)
        {
            _dapper = dapper;
        }


        public async Task<List<Genero>> lista()
        {
            return await _dapper.Consulta<Genero>("ObtenerTodosGeneros", null);
        }
    }

}
