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
        public GestionarAgrupacionService(IAgrupacionRepository agrupacionRepository)
        {
            _agrupacionRepository = agrupacionRepository;
        }

        public async Task<bool> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio)
        {
            try
            {
                return await _agrupacionRepository.AddAudioToAgrupacion(agrupacion_audio);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<Agrupacion> CreateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                return await _agrupacionRepository.CreateAgrupacion(agrupacion);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task DeleteAgrupacion(long id)
        {
            try
            {
                await _agrupacionRepository.DeleteAgrupacion(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<Agrupacion> GetAgrupacion(long id)
        {
            try
            {
                return await _agrupacionRepository.GetAgrupacion(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<List<Agrupacion>> GetAllAgrupacion(long userId)
        {

            try
            {
                return await _agrupacionRepository.GetAllAgrupacion(userId);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task UpdateAgrupacion(Agrupacion agrupacion)
        {

            try
            {
                await _agrupacionRepository.UpdateAgrupacion(agrupacion);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
