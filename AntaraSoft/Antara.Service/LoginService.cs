using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using Antara.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class LoginService:ILoginService
    {
        private readonly IUsuarioRepository usuarioRepo;
        private readonly IEncryptText encryptText;
        public LoginService(IUsuarioRepository usuarioRepo, IEncryptText encryptText)
        {
            this.usuarioRepo = usuarioRepo;
            this.encryptText = encryptText;
        }

        public async Task<Usuario> Login(string usuario, string password)
        {
            try
            {
                Usuario user = await usuarioRepo.Login(usuario);
                if (user != null)
                {
                    if (encryptText.ComprarHash(password, user.Password)) return user;
                    else throw new ApplicationException("Usuario o password incorrectos.");
                }else throw new ApplicationException("Usuario no encontrado.");

            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
