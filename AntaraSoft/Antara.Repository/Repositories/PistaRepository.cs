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


        public async Task<bool> VerificarUrlUnico(string url)
        {
            try
            {
                Pista respuesta = await _dapper.QueryWithReturn<Pista>("VerificarUrlUnico", new
                {
                    @Url = url
                });
                if (respuesta == null)
                {
                    return true;
                }
                return false;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task CrearPista(Pista audio)
        {
            try
            {
                await _dapper.QueryWithReturn<Pista>("CrearPista", new
                {
                    @Id = audio.Id,
                    @Url = audio.Url,
                    @Nombre = audio.Nombre,
                    @FechaRegistro = audio.FechaRegistro,
                    @AnoCreacion = audio.AnoCreacion,
                    @Interprete = audio.Interprete,
                    @Compositor = audio.Compositor,
                    @Productor = audio.Productor,
                    @Reproducciones = audio.Reproducciones,
                    @GeneroId = audio.GeneroId,
                    @UsuarioId = audio.UsuarioId
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


        public async Task EditarPista(Pista audio)
        {
            try
            {
                await _dapper.QueryWithReturn<dynamic>("EditarPista", new
                {
                    @Id = audio.Id,
                    @Url = audio.Url,
                    @Nombre = audio.Nombre,
                    @AnoCreacion = audio.AnoCreacion,
                    @Interprete = audio.Interprete,
                    @Compositor = audio.Compositor,
                    @Productor = audio.Productor,
                    @GeneroId = audio.GeneroId
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

        public async Task<List<Pista>> ObtenerTodosPistasDeGrupo(Guid grupoId)
        {
            try
            {
                var audiosList = await _dapper.Consulta<Pista>("ObtenerTodosPistasDeGrupo", new
                {
                    @GrupoId = grupoId
                });
                return audiosList;
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
                var audiosList = await _dapper.Consulta<Pista>("BuscarPistas", new
                {
                    @Cadena = cadena
                });
                return audiosList;
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
