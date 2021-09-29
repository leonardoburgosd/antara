using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts
{
    public interface IUsuarioRepository
    {
        Task<Usuario> CreateUsuario(Usuario usuario);
        Task<Usuario> GetUsuario(long id);
        Task<Usuario> Login(string email);
        Task<Boolean> CheckUniqueEmail(string email);
        Task PhysicalDeleteUsuario(long id);

    }
}
