using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Services
{
    public interface IGestionarPistaService
    {
        Task CrearPista(Pista pista);
        Task<Pista> ObtenerPista(Guid id);
        Task<List<Pista>> ObtenerTodosPistasDeGrupo(Guid grupoId);
        Task EditarPista(Pista pista);
        Task EliminarPista(Guid id);
        Task<List<Pista>> BuscarPistas(string cadena);
        Task ReproducirPista(Pista pista);

    }
}
