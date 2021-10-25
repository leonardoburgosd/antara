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
    public class AlbumRepository : IAlbumRepository
    {
        private readonly IDapper _dapper;
        public AlbumRepository(IDapper dapper)
        {
            _dapper = dapper;
        }
        public async Task CrearAlbum(Album album)
        {
            try
            {
                await _dapper.QueryWithReturn<Album>("CrearAlbum", new
                {
                    @Id = album.Id,
                    @Nombre = album.Nombre,
                    @Descripcion = album.Descripcion,
                    @EstaPublicado = album.EstaPublicado,
                    @FechaPublicacion = album.FechaPublicacion,
                    @PortadaUrl = album.PortadaUrl,
                    @UsuarioId = album.UsuarioId,
                    @EstaActivo = album.EstaActivo
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task EliminarAlbum(Guid id)
        {
            try
            {
                await _dapper.QueryWithReturn<Usuario>("EliminarAlbum", new
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


        public async Task EditarAlbum(Album album)
        {
            try
            {
                await _dapper.QueryWithReturn<Album>("EditarAlbum", new
                {
                    @Id = album.Id,
                    @Nombre = album.Nombre,
                    @Descripcion = album.Descripcion,
                    @PortadaUrl = album.PortadaUrl
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<Album> ObtenerAlbum(Guid id)
        {
            try
            {
                return await _dapper.QueryWithReturn<Album>("ObtenerAlbum", new
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

        public async Task<List<Album>> ObtenerTodosAlbumesDeUsuario(Guid userId)
        {
            try
            {
                return await _dapper.Consulta<Album>("ObtenerTodosAlbumesDeUsuarios", new
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

        public async Task<bool> PublicarAlbum(Album album)
        {
            try
            {
                int resultado = await _dapper.QueryWithReturn<int>("PublicarAlbum", new
                {
                    album.Id,
                    album.FechaPublicacion
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
