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

        public async Task<Boolean> CheckUniqueEmail(string email)
        {
            try
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
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
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

        public async Task<Usuario> GetUsuario(long id)
        {
            try
            {
                var response = await dapper.QueryWithReturn<Usuario>("GetUsuario", new
                {
                    @Id = id
                });
                if (response == null)
                {
                    return null;
                }
                return response;
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
                return await dapper.QueryWithReturn<Usuario>("Antara_Usuario_Login", new
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
