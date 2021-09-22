using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
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
        public LoginService(IUsuarioRepository usuarioRepo)
        {
            this.usuarioRepo = usuarioRepo;
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
    }
}
