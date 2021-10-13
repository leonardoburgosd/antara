using Antara.Model.Contracts;
using Antara.Model.Entities;
using Antara.Repository.Dapper;
using System;
using System.Threading.Tasks;

namespace Antara.Repository.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IDapper _dapper;
        public UsuarioRepository(IDapper dapper)
        {
            _dapper = dapper;
        }

        public async Task<Boolean> CheckUniqueEmail(string email)
        {
            try
            {
                Usuario response = await _dapper.QueryWithReturn<Usuario>("CheckUniqueEmail", new
                {
                    @Email = email
                });
                if (response == null)
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

        public async Task CreateUsuario(Usuario usuario)
        {
            try
            {
                Usuario nuevoUsuario = await _dapper.QueryWithReturn<Usuario>("CreateUsuario", new
                {
                    @Id = usuario.Id,
                    @Email = usuario.Email,
                    @Password = usuario.Password,
                    @Name = usuario.Name,
                    @BirthDate = usuario.BirthDate,
                    @Gender = usuario.Gender,
                    @Active = usuario.Active,
                    @RegistrationDate = usuario.RegistrationDate,
                    @Country = usuario.Country
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task PhysicalDeleteUsuario(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return PhysicalDeleteUsuarioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task PhysicalDeleteUsuarioInner(Guid id)
        {
            await _dapper.QueryWithReturn<Usuario>("PhysicalDeleteUsuario", new
            {
                @Id = id
            });
        }

        public async Task<Usuario> GetUsuario(Guid id)
        {
            try
            {
                return await _dapper.QueryWithReturn<Usuario>("GetUsuario", new
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

        public async Task<Usuario> Login(string email)
        {
            try
            {
                return await _dapper.QueryWithReturn<Usuario>("Login", new
                {
                    @Email = email
                });
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
