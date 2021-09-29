using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class GestionarAudioService : IGestionarAudioService
    {
        private readonly IAudioRepository audioRepository;
        public GestionarAudioService(IAudioRepository audioRepository)
        {
            this.audioRepository = audioRepository;
        }

        public async Task<Audio> CreateAudio(Audio audio)
        {
            try
            {
                if(IsUrlValid(audio.Url).Result)
                {
                    return await audioRepository.CreateAudio(audio);
                }
                throw new ArgumentException("Esta url ya se encuentra registrada.");
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task DeleteAudio(long id)
        {
            try
            {
                await audioRepository.DeleteAudio(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task EditAudio(Audio audio)
        {
            try
            {
                await audioRepository.EditAudio(audio);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public async Task<Audio> GetAudio(long id)
        {
            try
            {
                return await audioRepository.GetAudio(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task<List<Audio>> GetAudio()
        {
            throw new NotImplementedException();
        }

        private async Task<Boolean> IsUrlValid(string url)
        {
            try
            {
                return await audioRepository.CheckUniqueUrl(url);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }
    }
}
