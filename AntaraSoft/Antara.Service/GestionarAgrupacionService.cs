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
    public class GestionarAgrupacionService : IGestionarAgrupacionService
    {
        private readonly IAgrupacionRepository _agrupacionRepository;
        private enum TiposAgrupaciones
        {
            playlist,
            episodio,
            album
        }
        public GestionarAgrupacionService(IAgrupacionRepository agrupacionRepository)
        {
            _agrupacionRepository = agrupacionRepository;
        }

        public Task<bool> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio)
        {
            try
            {
                if (agrupacion_audio.Agrupacion_id == Guid.Empty || agrupacion_audio.Audio_id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(agrupacion_audio), "No se proporciono ningún valor");
                }
                return AddAudioToAgrupacionInner(agrupacion_audio);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task<bool> AddAudioToAgrupacionInner(Agrupacion_Audio agrupacion_audio)
        {
            return await _agrupacionRepository.AddAudioToAgrupacion(agrupacion_audio);
        }

        public Task CreateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                if(Enum.IsDefined(typeof(TiposAgrupaciones),agrupacion.Type.ToLower()))
                {
                    return CreateAgrupacionInner(agrupacion);
                }
                throw new ArgumentException("El tipo es desconocido.", nameof(agrupacion));
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task CreateAgrupacionInner(Agrupacion agrupacion)
        {
            await _agrupacionRepository.CreateAgrupacion(agrupacion);
        }

        public Task DeleteAgrupacion(Guid id)
        {
            try
            {
                if(id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return DeleteAgrupacionInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task DeleteAgrupacionInner(Guid id)
        {
            await _agrupacionRepository.DeleteAgrupacion(id);
        }

        public Task<Agrupacion> GetAgrupacion(Guid userId)
        {
            try
            {
                if(userId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(userId), "No se proporciono ningún valor");
                }
                return GetAgrupacionInner(userId);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task<Agrupacion> GetAgrupacionInner(Guid userId)
        {
            return await _agrupacionRepository.GetAgrupacion(userId);
        }

        public Task<List<Agrupacion>> GetAllAgrupacion(Guid userId)
        {

            try
            {
                if (userId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(userId), "No se proporciono ningún valor");
                }
                return GetAllAgrupacionInner(userId);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<List<Agrupacion>> GetAllAgrupacionInner(Guid userId)
        {
            return await _agrupacionRepository.GetAllAgrupacion(userId);
        }

        public Task UpdateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                if (Enum.IsDefined(typeof(TiposAgrupaciones), agrupacion.Type.ToLower()))
                {
                    return UpdateAgrupacionInner(agrupacion);
                }
                throw new ArgumentException("El tipo es desconocido.", nameof(agrupacion));
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task UpdateAgrupacionInner(Agrupacion agrupacion)
        {
            await _agrupacionRepository.UpdateAgrupacion(agrupacion);
        }

        public Task<bool> RemoveAudioFromAgrupacion(Guid agrupacionId, Guid audioId)
        {
            try
            {
                if (agrupacionId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(agrupacionId), "No se proporciono ningún valor");
                }
                else if(audioId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(audioId), "No se proporciono ningún valor");
                }
                return RemoveAudioFromAgrupacionInner(agrupacionId, audioId);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
        private async Task<bool> RemoveAudioFromAgrupacionInner(Guid agrupacionId, Guid audioId)
        {
            return await _agrupacionRepository.RemoveAudioFromAgrupacion(agrupacionId, audioId);
        }
    }
}
