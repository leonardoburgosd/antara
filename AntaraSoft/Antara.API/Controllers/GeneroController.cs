using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using Antara.Service;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/genero")]
    [ApiController]
    public class GeneroController : Controller
    {
        private readonly IGeneroService _generoService;

        public GeneroController(IGeneroService _generoService)
        {
            this._generoService = _generoService;
        }


        [HttpGet]
        public async Task<List<Genero>> listarGeneros()
        {
            return await _generoService.lista();
        }
    }
}
