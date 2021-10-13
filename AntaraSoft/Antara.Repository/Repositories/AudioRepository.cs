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


        public async Task<bool> CheckUniqueUrl(string url)
        {
            try
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
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task CreateAudio(Audio audio)
        {
            try
            {
                var nuevoAudio = await _dapper.QueryWithReturn<Audio>("CreateAudio", new
                {
                    @Id = audio.Id,
                    @Url = audio.Url,
                    @Name = audio.Name,
                    @RegistrationDate = audio.RegistrationDate,
                    @CreationYear = audio.CreationYear,
                    @Interpreter = audio.Interpreter,
                    @Writer = audio.Writer,
                    @Producer = audio.Producer,
                    @Reproductions = audio.Reproductions,
                    @Genero_id = audio.Genero_id,
                    @User_id = audio.User_id
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task DeleteAudio(Guid id)
        {
            try
            {
                await _dapper.QueryWithReturn<dynamic>("DeleteAudio", new
                {
                    @Id = id
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
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

        public async Task<Audio> GetAudio(Guid id)
        {
            try
            {
                return await _dapper.QueryWithReturn<Audio>("GetAudio", new
                {
                    @Id = id
                });
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public async Task<List<Audio>> GetAllAudio(Guid agrupacionId)
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
                    @Cad = cadena
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
