using Antara.Model;
using Antara.Model.Contracts.Services;
using Antara.Model.Dtos;
using Antara.Model.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/audio")]
    [ApiController]
    public class AudioController : Controller
    {
        private readonly IGestionarAudioService _gestionarAudioService;
        public AudioController(IGestionarAudioService gestionarAudioService)
        {
            _gestionarAudioService = gestionarAudioService;
        }

        [HttpPost]
        public async Task<ActionResult<AudioDto>> CreateAudioAsync([FromBody]CreateAudioDto audioDto)
        {
            try
            {
                Audio newAudio = new()
                {
                    Id = Guid.NewGuid(),
                    Name = audioDto.Name,
                    RegistrationDate = DateTime.Now,
                    CreationYear = audioDto.CreationYear,
                    Interpreter = audioDto.Interpreter,
                    Writer = audioDto.Writer,
                    Producer = audioDto.Producer,
                    Reproductions = 0,
                    Genero_id = audioDto.Genero_id,
                    Url = audioDto.Url,
                    User_id = audioDto.User_id
                };
                await _gestionarAudioService.CreateAudio(newAudio);
                return CreatedAtAction("GetAudio", new { id = newAudio.Id }, newAudio.AsDto());
            }
            catch (Exception err)
            {
                if (err.Message.Contains("Esta direccion url ya se encuentra registrada")
                    || err.Message.Contains("No se pudo crear el audio"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                else return StatusCode(500, err);
            }
        }

        [HttpGet("all/{agrupacionId}")]
        public async Task<ActionResult<List<AudioDto>>> GetAllAudioAsync(Guid agrupacionId)
        {
            try
            {
                var audioList = (await _gestionarAudioService.GetAllAudio(agrupacionId)).Select(item => item.AsDto());
                return StatusCode(200, audioList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AudioDto>> GetAudioAsync(Guid id)
        {
            try
            {
                var audio = await _gestionarAudioService.GetAudio(id);
                if (audio == null)
                {
                    return NotFound();
                }
                return StatusCode(200, audio.AsDto());
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAudioAsync(Guid id, UpdateAudioDto audioDto)
        {
            try
            {
                var existingAudio = await _gestionarAudioService.GetAudio(id);
                if(existingAudio == null)
                {
                    return NotFound();
                }
                Audio updatedAudio = existingAudio with
                {
                    Name = audioDto.Name,
                    CreationYear = audioDto.CreationYear,
                    Interpreter = audioDto.Interpreter,
                    Writer = audioDto.Writer,
                    Producer = audioDto.Producer,
                    Genero_id = audioDto.Genero_id,
                    Url = audioDto.Url,
                };
                await _gestionarAudioService.UpdateAudio(updatedAudio);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAudioAsync(Guid id)
        {
            try
            {
                var existingAudio = await _gestionarAudioService.GetAudio(id);
                if (existingAudio == null)
                {
                    return NotFound();
                }
                await _gestionarAudioService.DeleteAudio(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpGet("/search")]
        public async Task<ActionResult<List<AudioDto>>> SearchAudioAsync([Bind(Prefix = "cadena")] string cadena)
        {
            try
            {
                var audioList = (await _gestionarAudioService.SearchAudios(cadena)).Select(item => item.AsDto());
                return StatusCode(200, audioList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }
    }
}
