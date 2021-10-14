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

        public async Task CrearUsuario(Usuario usuario)
        {
            try
            {
                if(EsEmailValido(usuario.Email).Result)
                {
                    usuario.Password = encryptText.GeneratePasswordHash(usuario.Password);
                    await usuarioRepo.CrearUsuario(usuario);
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

        public Task<Usuario> ObtenerUsuario(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return ObtenerUsuarioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Usuario> ObtenerUsuarioInner(Guid id)
        {
            return await usuarioRepo.ObtenerUsuario(id);
        }

        public Task<bool> EsEmailValido(string email)
        {
            try
            {
                if (email == null)
                {
                    throw new ArgumentNullException(nameof(email), "No se proporciono ningún valor");
                }
                return EsEmailValidoInner(email);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Boolean> EsEmailValidoInner(string email)
        {
            return await usuarioRepo.VerificarEmailUnico(email);
        }
    }
}
