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

        public async Task CreateUsuario(Usuario usuario)
        {
            try
            {
                if(IsEmailValid(usuario.Email).Result)
                {
                    usuario.Password = encryptText.GeneratePasswordHash(usuario.Password);
                    await usuarioRepo.CreateUsuario(usuario);
                    return;
                }
                throw new ArgumentException("Este correo electrónico ya se encuentra registrado.");
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task<Usuario> GetUsuario(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
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

        private async Task<Usuario> GetUsuarioInner(Guid id)
        {
            return await usuarioRepo.GetUsuario(id);
        }

        public Task<Boolean> IsEmailValid(string email)
        {
            try
            {
                if (email == null)
                {
                    throw new ArgumentNullException(nameof(email), "No se proporciono ningún valor");
                }
                return IsEmailValidInner(email);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Boolean> IsEmailValidInner(string email)
        {
            return await usuarioRepo.CheckUniqueEmail(email);
        }
    }
}
