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

        public async Task CreateAudio(Audio audio)
        {
            try
            {
                if(IsUrlValid(audio.Url).Result)
                {
                    await audioRepository.CreateAudio(audio);
                    return;
                }
                throw new ArgumentException("Esta direccion url ya se encuentra registrada.");
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public Task DeleteAudio(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return DeleteAudioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task DeleteAudioInner(Guid id)
        {
            await audioRepository.DeleteAudio(id);
        }

        public async Task UpdateAudio(Audio audio)
        {
            try
            {
                if (IsUrlValid(audio.Url).Result)
                {
                    await audioRepository.UpdateAudio(audio);
                    return;
                }
                throw new ArgumentException("Esta direccion url ya se encuentra registrada.");
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public Task<Audio> GetAudio(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return GetAudioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<Audio> GetAudioInner(Guid id)
        {
            return await audioRepository.GetAudio(id);
        }

        public Task<List<Audio>> GetAllAudio(Guid agrupacionId)
        {
            try
            {
                if (agrupacionId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(agrupacionId), "No se proporciono ningún valor");
                }
                return GetAllAudioInner(agrupacionId);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<List<Audio>> GetAllAudioInner(Guid agrupacionId)
        {
            return await audioRepository.GetAllAudio(agrupacionId);
        }

        public Task<bool> IsUrlValid(string url)
        {
            try
            {
                if (url == null)
                {
                    throw new ArgumentNullException(nameof(url), "No se proporciono ningún valor");
                }
                return IsUrlValidInner(url);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<bool> IsUrlValidInner(string url)
        {
            return await audioRepository.CheckUniqueUrl(url);
        }


        public Task<List<Audio>> SearchAudios(string cadena)
        {
            try
            {
                if (cadena == null)
                {
                    throw new ArgumentNullException(nameof(cadena), "No se proporciono ningún valor");
                }
                return SearchAudiosInner(cadena);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<List<Audio>> SearchAudiosInner(string cadena)
        {
            return await audioRepository.SearchAudios(cadena);
        }
    }
}
