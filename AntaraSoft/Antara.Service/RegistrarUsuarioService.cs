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
                if(IsEmailValid(usuario.Email).Result)
                {
                    usuario.Password = encryptText.GeneratePasswordHash(usuario.Password);
                    return await usuarioRepo.CreateUsuario(usuario);
                }
                throw new ArgumentException("Este correo electrónico ya se encuentra registrado.");
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

        private async Task<Boolean> IsEmailValid(string email)
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
