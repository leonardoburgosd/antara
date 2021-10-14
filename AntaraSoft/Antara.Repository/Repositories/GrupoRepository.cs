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
    public class GrupoRepository : IGrupoRepository
    {
        private readonly IDapper _dapper;
        public GrupoRepository(IDapper dapper)
        {
            _dapper = dapper;
        }
        public async Task CrearGrupo(Grupo grupo)
        {
            try
            {
                await _dapper.QueryWithReturn<Grupo>("CrearGrupo", new
                {
                    @Id = grupo.Id,
                    @Nombre = grupo.Nombre,
                    @Descripcion = grupo.Descripcion,
                    @estaPublicado = grupo.EstaPublicado,
                    @FechaPublicacion = grupo.FechaPublicacion,
                    @Tipo = grupo.Tipo,
                    @UsuarioId = grupo.UsuarioId
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task EliminarGrupo(Guid id)
        {
            try
            {
                await _dapper.QueryWithReturn<Usuario>("EliminarGrupo", new
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


        public async Task EditarGrupo(Grupo grupo)
        {
            try
            {
                await _dapper.QueryWithReturn<Grupo>("EditarGrupo", new
                {
                    @Id = grupo.Id,
                    @Nombre = grupo.Nombre,
                    @Descripcion = grupo.Descripcion,
                    @estaPublicado = grupo.EstaPublicado,
                    @Tipo = grupo.Tipo
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<Grupo> ObtenerGrupo(Guid id)
        {
            try
            {
                return await _dapper.QueryWithReturn<Grupo>("ObtenerGrupo", new
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

        public async Task<List<Grupo>> ObtenerTodosGruposDeUsuario(Guid userId)
        {
            try
            {
                return await _dapper.Consulta<Grupo>("ObtenerTodosGruposDeUsuarios", new
                {
                    @UsuarioId = userId,
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<bool> AgregarPistaAGrupo(GrupoPista grupoPista)
        {
            try
            {
                GrupoPista respuesta = await _dapper.QueryWithReturn<GrupoPista>("AgregarPistaAGrupo", new
                {
                    @GrupoId = grupoPista.GrupoId,
                    @PistaId = grupoPista.PistaId,
                    @FechaRegistro = DateTime.Now
                });
                if(respuesta == null)
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

        public async Task<bool> QuitarPistaDeGrupo(GrupoPista grupoPista)
        {
            try
            {
                int resultado = await _dapper.QueryWithReturn<int>("QuitarPistaDeGrupo", new
                {
                    @GrupoId = grupoPista.GrupoId,
                    @PistaId = grupoPista.PistaId
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

        public async Task<bool> PublicarGrupo(Grupo grupo)
        {
            try
            {
                int resultado = await _dapper.QueryWithReturn<int>("PublicarGrupo", new
                {
                    @Id = grupo.Id,
                    @estaPublicado = grupo.EstaPublicado,
                    @FechaPublicacion = grupo.FechaPublicacion
                });
                if (resultado == 0)
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
