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
    public class UsuarioRepository : IUsuario
    {
        private readonly IDapper dapper;
        private AppSettings settings;
        public UsuarioRepository(IDapper dapper, IOptions<AppSettings> options)
        {
            this.dapper = dapper;
            settings = options.Value;
        }
        public async Task CreateUsuario(Usuario usuario)
        {
            try
            {
                dynamic response = await dapper.Consultas<dynamic>(settings.ConexionString, "CreateUsuario", new
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
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task DeleteUsuario(long id)
        {
            try
            {
                dynamic response = await dapper.Consultas<dynamic>(settings.ConexionString, "DeleteUsuario", new
                {
                    @Id = id,
                    @Active = false
                });
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task<IEnumerable<Usuario>> GetUsuario()
        {
            try
            {
                IEnumerable<Usuario> response = await dapper.Consultas<Usuario>(settings.ConexionString, "GetActiveUsuarios");
                return response;
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task<Usuario> GetUsuario(long id)
        {
            try
            {
                var response = await dapper.Consultas<Usuario>(settings.ConexionString, "GetUsuario", new
                {
                    @Id = id
                });
                if(response == null)
                {
                    return null;
                }
                return response[0];
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task UpdateUsuario(Usuario usuario)
        {
            try
            {
                dynamic response = await dapper.Consultas<dynamic>(settings.ConexionString, "UpdateUsuario", new
                {
                    @Id = usuario.Id,
                    @Name = usuario.Name,
                    @BirthDate = usuario.BirthDate,
                    @Gender = usuario.Gender,
                    @Country = usuario.Country
                });
            }
            catch (Exception err)
            {
                throw err;
            }
        }
    }
}
