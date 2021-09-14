using Antara.Entity;
using Antara.Interface;
using System;
using System.Threading.Tasks;

namespace Antara.Repository
{
    public class UsuarioRepository : IUsuarioRepository
    {
        public Task<usuarios> create(AppSettings settings, usuarios usuario)
        {
            throw new NotImplementedException();
        }
    }
}
