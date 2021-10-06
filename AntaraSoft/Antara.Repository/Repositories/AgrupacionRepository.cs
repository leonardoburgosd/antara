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
                    @Published = false,
                    @Tipe = agrupacion.Tipe
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
            await _dapper.QueryWithReturn<Usuario>("DeleteAudio", new
            {
                @Id = id
            });
        }

        public async Task UpdateAgrupacion(Agrupacion agrupacion)
        {
            try
            {
                await _dapper.QueryWithReturn<Agrupacion>("CreateAgrupacion", new
                {
                    @Name = agrupacion.Name,
                    @Description = agrupacion.Description,
                    @Published = false,
                    @Tipe = agrupacion.Tipe
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
            return await _dapper.QueryWithReturn<Agrupacion>("GetAudio", new
            {
                @Id = id
            });
        }

        public async Task<List<Agrupacion>> GetAgrupacion()
        {
            try
            {
                return await _dapper.Consulta<Agrupacion>("GetAgrupacion");
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        
    }
}
