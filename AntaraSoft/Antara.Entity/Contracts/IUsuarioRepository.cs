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
        Task<IEnumerable<Usuario>> GetUsuario();
        Task UpdateUsuario(Usuario usuario);
        Task<Usuario> GetUsuario(long id);
        Task<long> DeleteUsuario(long id);
        Task<Usuario> Login(string usuario, string password);
    }
}
