using Antara.Model.Contracts;
using Antara.Model.Entities;
using Antara.Repository.Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Repository.Repositories
{
    public class PistaRepository : IPistaRepository
    {
        private readonly IDapper _dapper;
        public PistaRepository(IDapper dapper)
        {
            _dapper = dapper;
        }

        public async Task CrearPista(Pista pista)
        {
            try
            {
                await _dapper.QueryWithReturn<Pista>("CrearPista", new
                {
                    @Id = pista.Id,
                    @Url = pista.Url,
                    @Nombre = pista.Nombre,
                    @FechaRegistro = pista.FechaRegistro,
                    @AnoCreacion = pista.AnoCreacion,
                    @Interprete = pista.Interprete,
                    @Compositor = pista.Compositor,
                    @Productor = pista.Productor,
                    @Reproducciones = pista.Reproducciones,
                    @GeneroId = pista.GeneroId,
                    @AlbumId = pista.AlbumId,
                    @EstaActivo = pista.EstaActivo
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task EliminarPista(Guid id)
        {
            try
            {
                await _dapper.QueryWithReturn<dynamic>("EliminarPista", new
                {
                    @Id = id
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }


        public async Task EditarPista(Pista pista)
        {
            try
            {
                await _dapper.QueryWithReturn<dynamic>("EditarPista", new
                {
                    @Id = pista.Id,
                    @Url = pista.Url,
                    @Nombre = pista.Nombre,
                    @AnoCreacion = pista.AnoCreacion,
                    @Interprete = pista.Interprete,
                    @Compositor = pista.Compositor,
                    @Productor = pista.Productor,
                    @GeneroId = pista.GeneroId
                });
            }
 
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task<Pista> ObtenerPista(Guid id)
        {
            try
            {
                return await _dapper.QueryWithReturn<Pista>("ObtenerPista", new
                {
                    @Id = id
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task<List<Pista>> ObtenerTodosPistasDeAlbum(Guid AlbumId)
        {
            try
            {
                var pistasList = await _dapper.Consulta<Pista>("ObtenerTodosPistasDeAlbum", new
                {
                    @AlbumId = AlbumId
                });
                return pistasList;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task<List<Pista>> ObtenerTodosPistasDePlaylist(Guid PlaylistId)
        {
            try
            {
                var pistasList = await _dapper.Consulta<Pista>("ObtenerTodosPistasDePlaylist", new
                {
                    @PlaylistId = PlaylistId
                });
                return pistasList;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task<List<Pista>> BuscarPistass(string cadena)
        {
            try
            {
                var pistasList = await _dapper.Consulta<Pista>("BuscarPistas", new
                {
                    @Cadena = cadena
                });
                return pistasList;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task ReproducirPista(Guid id, int Reproducciones)
        {
            try
            {
                await _dapper.QueryWithReturn<Pista>("ReproducirPista", new
                {
                    @Id = id,
                    @Reproducciones = Reproducciones
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }
    }
}
