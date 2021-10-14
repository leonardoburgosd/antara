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
    public class GestionarGrupoService : IGestionarGrupoService
    {
        private readonly IGrupoRepository _agrupacionRepository;
        private enum TiposAgrupaciones
        {
            playlist,
            episodio,
            album
        }
        public GestionarGrupoService(IGrupoRepository agrupacionRepository)
        {
            _agrupacionRepository = agrupacionRepository;
        }

        public Task<bool> AgregarPistaAGrupo(GrupoPista grupoPista)
        {
            try
            {
                if (grupoPista.GrupoId == Guid.Empty || grupoPista.PistaId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(grupoPista), "No se proporciono ningún valor");
                }
                return AgregarPistaAGrupoInner(grupoPista);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task<bool> AgregarPistaAGrupoInner(GrupoPista grupoPista)
        {
            return await _agrupacionRepository.AgregarPistaAGrupo(grupoPista);
        }

        public Task CrearGrupo(Grupo agrupacion)
        {
            try
            {
                if(Enum.IsDefined(typeof(TiposAgrupaciones),agrupacion.Tipo.ToLower()))
                {
                    return CrearGrupoInner(agrupacion);
                }
                throw new ArgumentException("El tipo es desconocido.", nameof(agrupacion));
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task CrearGrupoInner(Grupo agrupacion)
        {
            await _agrupacionRepository.CrearGrupo(agrupacion);
        }

        public Task EliminarGrupo(Guid id)
        {
            try
            {
                if(id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return EliminarGrupoInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task EliminarGrupoInner(Guid id)
        {
            await _agrupacionRepository.EliminarGrupo(id);
        }

        public Task<Grupo> ObtenerGrupo(Guid id)
        {
            try
            {
                if(id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return ObtenerGrupoInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task<Grupo> ObtenerGrupoInner(Guid id)
        {
            return await _agrupacionRepository.ObtenerGrupo(id);
        }

        public Task<List<Grupo>> ObtenerTodosGruposDeUsuario(Guid userId)
        {

            try
            {
                if (userId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(userId), "No se proporciono ningún valor");
                }
                return ObtenerTodosGruposDeUsuarioInner(userId);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<List<Grupo>> ObtenerTodosGruposDeUsuarioInner(Guid userId)
        {
            return await _agrupacionRepository.ObtenerTodosGruposDeUsuario(userId);
        }

        public Task EditarGrupo(Grupo agrupacion)
        {
            try
            {
                if (Enum.IsDefined(typeof(TiposAgrupaciones), agrupacion.Tipo.ToLower()))
                {
                    return EditarGrupoInner(agrupacion);
                }
                throw new ArgumentException("El tipo es desconocido.", nameof(agrupacion));
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task EditarGrupoInner(Grupo agrupacion)
        {
            await _agrupacionRepository.EditarGrupo(agrupacion);
        }

        public Task<bool> QuitarPistaDeGrupo(GrupoPista grupoPista)
        {
            try
            {
                if (grupoPista.GrupoId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(grupoPista.GrupoId), "No se proporciono ningún valor");
                }
                else if(grupoPista.PistaId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(grupoPista.PistaId), "No se proporciono ningún valor");
                }
                return QuitarPistaDeGrupoInner(grupoPista);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task<bool> QuitarPistaDeGrupoInner(GrupoPista grupoPista)
        {
            return await _agrupacionRepository.QuitarPistaDeGrupo(grupoPista);
        }

        public async Task<bool> PublicarGrupo(Grupo agrupacion)
        {
            try
            {
                if(!agrupacion.EstaPublicado)
                {
                    agrupacion.PublicarGrupo();
                    return await _agrupacionRepository.PublicarGrupo(agrupacion);
                }
                throw new ArgumentException("La agrupación ya se encuentra publicada");
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
