using Antara.Model.Contracts.Repository;
using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class GestionarGeneroService : IGeneroService
    {
        private readonly IGeneroRepository _generoRepository;


        public GestionarGeneroService(IGeneroRepository _generoRepository)
        {
            this._generoRepository = _generoRepository;
        }

        public async Task<List<Genero>> lista()
        {
            return await _generoRepository.lista();
        }
    }
}

