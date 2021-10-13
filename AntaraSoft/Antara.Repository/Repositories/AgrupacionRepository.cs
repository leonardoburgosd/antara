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
        public async Task CreateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                var newAgrupacion = await _dapper.QueryWithReturn<Agrupacion>("CreateAgrupacion", new
                {
                    @Id = agrupacion.Id,
                    @Name = agrupacion.Name,
                    @Description = agrupacion.Description,
                    @isPublished = agrupacion.IsPublished,
                    @PublicationDate = agrupacion.PublicationDate,
                    @Type = agrupacion.Type,
                    @User_id = agrupacion.User_id
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task DeleteAgrupacion(Guid id)
        {
            try
            {
                await _dapper.QueryWithReturn<Usuario>("DeleteAgrupacion", new
                {
                    @Id = id
                });
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

        public async Task<Agrupacion> GetAgrupacion(Guid id)
        {
            try
            {
                return await _dapper.QueryWithReturn<Agrupacion>("GetAgrupacion", new
                {
                    @Id = id,
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<List<Agrupacion>> GetAllAgrupacion(Guid userId)
        {
            try
            {
                return await _dapper.Consulta<Agrupacion>("GetAllAgrupaciones", new
                {
                    @User_id = userId,
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<bool> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio)
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

        public async Task<bool> RemoveAudioFromAgrupacion(Guid agrupacionId, Guid audioId)
        {
            try
            {
                int resultado = await _dapper.QueryWithReturn<int>("RemoveAudioFromAgrupacion", new
                {
                    @Agrupacion_id = agrupacionId,
                    @Audio_id = audioId
                });
                if(resultado == 0)
                {
                    return true;
                }
                return false;
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
