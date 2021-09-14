using Antara.Entity;
using System;
using System.Threading.Tasks;

namespace Antara.Interface
{
    public interface IUsuarioRepository
    {
        Task<usuarios> create(AppSettings settings, usuarios usuario);
    }
}
