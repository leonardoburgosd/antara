using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts
{
    public interface IRegistrarUsuarioService
    {
        Task CreateUsuario(Usuario usuario);
        Task<Usuario> GetUsuario(Guid id);
    }
}
