using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Services
{
    public interface IGestionarGrupoService
    {
        Task CrearGrupo(Grupo grupo);
        Task<Grupo> ObtenerGrupo(Guid id);
        Task<List<Grupo>> ObtenerTodosGruposDeUsuario(Guid usuarioId);
        Task EditarGrupo(Grupo grupo);
        Task EliminarGrupo(Guid id);
        Task<bool> AgregarPistaAGrupo(GrupoPista grupoPista);
        Task<bool> QuitarPistaDeGrupo(GrupoPista grupoPista);
        Task<bool> PublicarGrupo(Grupo grupo);
    }
}
