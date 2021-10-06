using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Services
{
    public interface IGestionarAgrupacionService
    {
        Task<Agrupacion> CreateAgrupacion(Agrupacion agrupacion);
        Task<Agrupacion> GetAgrupacion(long id);
        Task<List<Agrupacion>> GetAllAgrupacion(long userId);
        Task UpdateAgrupacion(Agrupacion agrupacion);
        Task DeleteAgrupacion(long id);
        Task<bool> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio);
    }
}
