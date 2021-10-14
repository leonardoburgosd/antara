using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts
{
    public interface IPistaRepository
    {
        Task CrearPista(Pista pista);
        Task<Pista> ObtenerPista(Guid id);
        Task<List<Pista>> ObtenerTodosPistasDeGrupo(Guid grupoId);
        Task EditarPista(Pista pista);
        Task EliminarPista(Guid id);
        Task<bool> VerificarUrlUnico(string url);
        Task<List<Pista>> BuscarPistass(string cadena);
        Task ReproducirPista(Guid id, int reproducciones);
    }
}
