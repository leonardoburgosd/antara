using Antara.Model;
using Antara.Model.Contracts;
using Antara.Model.Entities;
using Antara.Repository.Dapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Repository.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IDapper dapper;
        public UsuarioRepository(IDapper dapper)
        {
            this.dapper = dapper;
        }

        public Task<Boolean> CheckUniqueEmail(string email)
        {
            try
            {
                if(email == null)
                {
                    throw new ArgumentNullException(nameof(email), "No se proporciono ningún valor");
                }
                return CheckUniqueEmailInner(email);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Boolean> CheckUniqueEmailInner(string email)
        {
            Usuario response = await dapper.QueryWithReturn<Usuario>("CheckUniqueEmail", new
            {
                @Email = email
            });
            if (response == null)
            {
                return true;
            }
            return false;
        }

        public async Task<Usuario> CreateUsuario(Usuario usuario)
        {
            try
            {
                Usuario nuevoUsuario = await dapper.QueryWithReturn<Usuario>("CreateUsuario", new
                {
                    @Email = usuario.Email,
                    @Password = usuario.Password,
                    @Name = usuario.Name,
                    @BirthDate = usuario.BirthDate,
                    @Gender = usuario.Gender,
                    @Active = true,
                    @RegistrationDate = DateTime.Now,
                    @Country = usuario.Country
                });
                return nuevoUsuario;
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task PhysicalDeleteUsuario(long id)
        {
            try
            {
                if (id == 0)
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

        private async Task PhysicalDeleteUsuarioInner(long id)
        {
            await dapper.QueryWithReturn<Usuario>("PhysicalDeleteUsuario", new
            {
                @Id = id
            });
        }

        public Task<Usuario> GetUsuario(long id)
        {
            try
            {
                if(id == 0)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return GetUsuarioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Usuario> GetUsuarioInner(long id)
        {
            return await dapper.QueryWithReturn<Usuario>("GetUsuario", new
            {
                @Id = id
            });
        }

        public Task<Usuario> Login(string email)
        {
            try
            {
                if (email == null)
                {
                    throw new ArgumentNullException(nameof(email), "No se proporciono ningún valor");
                }
                return LoginInner(email);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Usuario> LoginInner(string email)
        {
            return await dapper.QueryWithReturn<Usuario>("Antara_Usuario_Login", new
            {
                @Email = email
            });
        }
    }
}
