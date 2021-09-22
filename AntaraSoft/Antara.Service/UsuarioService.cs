using Antara.Model.Contracts;
using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class UsuarioService : IUsuarioServices
    {
        private readonly IUsuarioRepository usuarioRepo;
        public UsuarioService(IUsuarioRepository usuarioRepo)
        {
            this.usuarioRepo = usuarioRepo;
        }

        public async Task<Boolean> CreateUsuario(Usuario usuario)
        {
            try
            {
                usuario = await usuarioRepo.CreateUsuario(usuario);
                if (usuario.Id != 0) return true;
                else return false;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public async Task<Usuario> GetUsuario(long id)
        {
            try
            {
                return await usuarioRepo.GetUsuario(id);
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public async Task<Usuario> Login(string usuario, string password)
        {
            try
            {
                Usuario user = await usuarioRepo.Login(usuario, password);
                if (user == null)
                    throw new ApplicationException("Usuario o password incorrectos");
                return user;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        /*
        public async Task<Boolean> DeleteUsuario(long id)
        {
            try
            {
                id = await usuarioRepo.DeleteUsuario(id);
                return true;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        
        public async Task<IEnumerable<Usuario>> GetUsuario()
        {
            try
            {
                return await usuarioRepo.GetUsuario();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        

        public async Task<Boolean> UpdateUsuario(Usuario usuario)
        {
            try
            {
                await usuarioRepo.UpdateUsuario(usuario);
                return true;
            }
            catch (Exception e)
            {
                throw;
            }
        }
        */
    }
}
