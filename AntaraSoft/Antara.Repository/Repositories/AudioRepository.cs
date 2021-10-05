using Antara.Model.Contracts;
using Antara.Model.Entities;
using Antara.Repository.Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Repository.Repositories
{
    public class AudioRepository : IAudioRepository
    {
        private readonly IDapper dapper;
        public AudioRepository(IDapper dapper)
        {
            this.dapper = dapper;
        }
        public Task<bool> CheckUniqueUrl(string url)
        {
            try
            {
                if (url == null)
                {
                    throw new ArgumentNullException(nameof(url), "No se proporciono ningún valor");
                }
                return CheckUniqueUrlInner(url);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<bool> CheckUniqueUrlInner(string url)
        {
            Audio response = await dapper.QueryWithReturn<Audio>("CheckUniqueUrl", new
            {
                @Url = url
            });
            if (response == null)
            {
                return true;
            }
            return false;
        }

        public async Task<Audio> CreateAudio(Audio audio)
        {
            try
            {
                var nuevoAudio = await dapper.QueryWithReturn<Audio>("CreateAudio", new
                {
                    @Url = audio.Url,
                    @Name = audio.Name,
                    @RegistrationDate = DateTime.Now,
                    @CreationYear = audio.CreationYear,
                    @Interpreter = audio.Interpreter,
                    @Writer = audio.Writer,
                    @Producer = audio.Producer,
                    @Reproductions = 0,
                    @Gender = audio.Gender,
                }) ;
                return nuevoAudio;
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task DeleteAudio(long id)
        {
            try
            {
                if (id == 0)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return DeleteAudioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task DeleteAudioInner(long id)
        {
            await dapper.QueryWithReturn<Usuario>("DeleteAudio", new
            {
                @Id = id
            });
        }

        public Task EditAudio(Audio audio)
        {
            throw new NotImplementedException();
        }

        public Task<Audio> GetAudio(long id)
        {
            try
            {
                if (id == 0)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return GetAudioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Audio> GetAudioInner(long id)
        {
            return await dapper.QueryWithReturn<Audio>("GetAudio", new
            {
                @Id = id
            });
        }

        public Task<List<Audio>> GetAudio()
        {
            throw new NotImplementedException();
        }
    }
}
