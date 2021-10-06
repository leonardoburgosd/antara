using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : Controller
    {
        private readonly IGestionarAudioService _gestionarAudioService;
        public AudioController(IGestionarAudioService gestionarAudioService)
        {
            _gestionarAudioService = gestionarAudioService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateAudioAsync([FromBody]Audio audio)
        {
            try
            {
                var newAudio = await _gestionarAudioService.CreateAudio(audio);
                return CreatedAtAction("GetAudio", new { id = newAudio.Id }, newAudio);
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

        [HttpGet]
        public async Task<ActionResult<Audio>> GetAudioAsync()
        {
            try
            {
                var audioList = await _gestionarAudioService.GetAudio();
                return StatusCode(200, audioList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Audio>> GetAudioAsync(long id)
        {
            try
            {
                Audio audio = await _gestionarAudioService.GetAudio(id);
                if (audio == null)
                    return NotFound();
                return StatusCode(200, audio);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAudioAsync(Audio audio)
        {
            try
            {
                await _gestionarAudioService.UpdateAudio(audio);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteAudioAsync(long id)
        {
            try
            {
                await _gestionarAudioService.DeleteAudio(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }
    }
}
