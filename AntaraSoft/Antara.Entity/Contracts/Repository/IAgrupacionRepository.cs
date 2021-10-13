using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Repository
{
    public interface IAgrupacionRepository
    {
        Task CreateAgrupacion(Agrupacion agrupacion);
        Task<Agrupacion> GetAgrupacion(Guid id);
        Task<List<Agrupacion>> GetAllAgrupacion(Guid userId);
        Task UpdateAgrupacion(Agrupacion agrupacion);
        Task DeleteAgrupacion(Guid id);
        Task<bool> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio);
        Task<bool> RemoveAudioFromAgrupacion(Guid agrupacionId, Guid audioId);
    }
}
