using Antara.Model.Contracts;
using Antara.Model.Entities;
using Antara.Security;
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
        private readonly IEncryptText encryptText;

        public RegistrarUsuarioService(IUsuarioRepository usuarioRepo, IEncryptText encryptText)
        {
            this.usuarioRepo = usuarioRepo;
            this.encryptText = encryptText;
        }

        public async Task<Usuario> CreateUsuario(Usuario usuario)
        {
            try
            {
                usuario.Password = encryptText.GeneratePasswordHash(usuario.Password);
                usuario = await usuarioRepo.CreateUsuario(usuario);
                return usuario;
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
                return await usuarioRepo.GetUsuario(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<Boolean> IsEmailValid(string email)
        {
            try
            {
                return await usuarioRepo.CheckUniqueEmail(email);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
