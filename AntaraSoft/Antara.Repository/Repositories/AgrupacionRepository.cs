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
    public class AgrupacionRepository : IAgrupacionRepository
    {
        private readonly IDapper _dapper;
        public AgrupacionRepository(IDapper dapper)
        {
            _dapper = dapper;
        }
        public async Task<Agrupacion> CreateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                var newAgrupacion = await _dapper.QueryWithReturn<Agrupacion>("CreateAgrupacion", new
                {
                    @Name = agrupacion.Name,
                    @Description = agrupacion.Description,
                    @isPublished = false,
                    @Type = agrupacion.Type,
                    @Usuario_id = agrupacion.Usuario_id
                });
                return newAgrupacion;
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task DeleteAgrupacion(long id)
        {
            try
            {
                if (id == 0)
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
        private async Task DeleteAgrupacionInner(long id)
        {
            await _dapper.QueryWithReturn<Usuario>("DeleteAgrupacion", new
            {
                @Id = id
            });
        }

        public async Task UpdateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                await _dapper.QueryWithReturn<Agrupacion>("UpdateAgrupacion", new
                {
                    @Id = agrupacion.Id,
                    @Name = agrupacion.Name,
                    @Description = agrupacion.Description,
                    @isPublished = agrupacion.IsPublished,
                    @Type = agrupacion.Type
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task<Agrupacion> GetAgrupacion(long id)
        {
            try
            {
                if (id == 0)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return GetAgrupacionInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }


        public async Task<Agrupacion> GetAgrupacionInner(long id)
        {
            return await _dapper.QueryWithReturn<Agrupacion>("GetAgrupacion", new
            {
                @Id = id
            });
        }

        public async Task<List<Agrupacion>> GetAllAgrupacion(long userId)
        {
            try
            {
                return await _dapper.Consulta<Agrupacion>("GetAllAgrupaciones");
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task<bool> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio)
        {
            try
            {
                if (agrupacion_audio.Agrupacion_id == 0 || agrupacion_audio.Audio_id == 0)
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
            try
            {
                Agrupacion_Audio response = await _dapper.QueryWithReturn<Agrupacion_Audio>("AddAudioToAgrupacion", new
                {
                    @Agrupacion_id = agrupacion_audio.Agrupacion_id,
                    @Audio_id = agrupacion_audio.Audio_id,
                    @RegistrationDate = DateTime.Now
                });
                if(response == null)
                {
                    return false;
                }
                return true;
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
