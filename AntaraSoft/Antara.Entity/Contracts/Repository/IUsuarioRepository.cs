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
        Task CreateUsuario(Usuario usuario);
        Task<Usuario> GetUsuario(Guid id);
        Task<Usuario> Login(string email);
        Task<Boolean> CheckUniqueEmail(string email);
        Task PhysicalDeleteUsuario(Guid id);

    }
}
