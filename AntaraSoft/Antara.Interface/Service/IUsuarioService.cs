using Antara.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Interface.Service
{
    public interface IUsuarioService
    {
        Task<usuarios> create(AppSettings settings, usuarios usuario);
    }
}
