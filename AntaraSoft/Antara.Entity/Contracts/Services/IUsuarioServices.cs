using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts
{
    public interface IUsuarioServices
    {
        Task<Usuario> GetUsuario(long id);
        /*
        Task<IEnumerable<Usuario>> GetUsuario();
        Task<Boolean> UpdateUsuario(Usuario usuario);
        Task<Boolean> DeleteUsuario(long id);
        */
    }
}
