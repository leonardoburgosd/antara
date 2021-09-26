using Antara.Model.Contracts;
using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class RegistrarUsuarioService : IRegistrarUsuarioService
    {
        private readonly IUsuarioRepository usuarioRepo;
        public RegistrarUsuarioService(IUsuarioRepository usuarioRepo)
        {
            this.usuarioRepo = usuarioRepo;
        }

        public async Task<Usuario> CreateUsuario(Usuario usuario)
        {
            try
            {
                var newUsuario = await usuarioRepo.CreateUsuario(usuario);
                return newUsuario;
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

        public async Task<Boolean> IsEmailValid(string email)
        {
            try
            {
                return await usuarioRepo.CheckUniqueEmail(email);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
