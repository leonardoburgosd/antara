using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Services
{
    public interface IGestionarAudioService
    {
        Task<Audio> CreateAudio(Audio audio);
        Task<Audio> GetAudio(long id);
        Task<List<Audio>> GetAudio();
        Task EditAudio(Audio audio);
        Task DeleteAudio(long id);

    }
}
