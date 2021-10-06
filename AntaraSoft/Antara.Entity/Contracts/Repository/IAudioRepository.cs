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
        Task<Audio> CreateAudio(Audio audio);
        Task<Audio> GetAudio(long id);
        Task<List<Audio>> GetAllAudio(long agrupacionId);
        Task UpdateAudio(Audio audio);
        Task DeleteAudio(long id);
        Task<Boolean> CheckUniqueUrl(string url);
        Task<List<Audio>> SearchAudios(string cadena);
    }
}
