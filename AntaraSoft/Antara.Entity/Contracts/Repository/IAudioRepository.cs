using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts
{
    public interface IAudioRepository
    {
        Task CreateAudio(Audio audio);
        Task<Audio> GetAudio(Guid id);
        Task<List<Audio>> GetAllAudio(Guid agrupacionId);
        Task UpdateAudio(Audio audio);
        Task DeleteAudio(Guid id);
        Task<Boolean> CheckUniqueUrl(string url);
        Task<List<Audio>> SearchAudios(string cadena);
    }
}
