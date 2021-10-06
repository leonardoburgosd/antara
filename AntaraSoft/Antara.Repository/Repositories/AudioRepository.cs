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
        private readonly IDapper _dapper;
        public AudioRepository(IDapper dapper)
        {
            _dapper = dapper;
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
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<bool> CheckUniqueUrlInner(string url)
        {
            Audio response = await _dapper.QueryWithReturn<Audio>("CheckUniqueUrl", new
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
                var nuevoAudio = await _dapper.QueryWithReturn<Audio>("CreateAudio", new
                {
                    @Url = audio.Url,
                    @Name = audio.Name,
                    @RegistrationDate = DateTime.Now,
                    @CreationYear = audio.CreationYear,
                    @Interpreter = audio.Interpreter,
                    @Writer = audio.Writer,
                    @Producer = audio.Producer,
                    @Reproductions = 0,
                    @Genero_id = audio.Genero_id
                }) ;
                return nuevoAudio;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
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
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task DeleteAudioInner(long id)
        {
            await _dapper.QueryWithReturn<dynamic>("DeleteAudio", new
            {
                @Id = id
            });
        }

        public async Task UpdateAudio(Audio audio)
        {
            try
            {
                await _dapper.QueryWithReturn<dynamic>("UpdateAudio", new
                {
                    @Id = audio.Id,
                    @Url = audio.Url,
                    @Name = audio.Name,
                    @CreationYear = audio.CreationYear,
                    @Interpreter = audio.Interpreter,
                    @Writer = audio.Writer,
                    @Producer = audio.Producer,
                    @Genero_id = audio.Genero_id
                });
            }
 
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
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
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<Audio> GetAudioInner(long id)
        {
            return await _dapper.QueryWithReturn<Audio>("GetAudio", new
            {
                @Id = id
            });
        }

        public async Task<List<Audio>> GetAllAudio(long agrupacionId)
        {
            try
            {
                var audiosList = await _dapper.Consulta<Audio>("GetAllAudios", new
                {
                    @Agrupacion_id = agrupacionId
                });
                return audiosList;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task<List<Audio>> SearchAudios(string cadena)
        {
            try
            {
                var audiosList = await _dapper.Consulta<Audio>("SearchAudios", new
                {
                    @Cadena = cadena
                });
                return audiosList;
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }
    }
}
