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
    [Route("api/agrupacion")]
    [ApiController]
    public class AgrupacionController : Controller
    {
        private readonly IGestionarAgrupacionService _agrupacionService;

        public AgrupacionController(IGestionarAgrupacionService agrupacionService)
        {
            _agrupacionService = agrupacionService;
        }

        // url: "localhost:8080/api/agrupacion"
        [HttpPost]
        public async Task<ActionResult> CreateAgrupacionAsync([FromBody] Agrupacion agrupacion)
        {
            try
            {
                var newAgrupacion = await _agrupacionService.CreateAgrupacion(agrupacion);
                return CreatedAtAction("GetAgrupacion", new { id = newAgrupacion.Id }, newAgrupacion);
            }
            catch (Exception err)
            {
                if (err.Message.Contains("No se pudo crear la agrupacion"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                else return StatusCode(500, err.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Audio>> GetAgrupacionAsync(long id)
        {
            try
            {
                var audioList = await _agrupacionService.GetAgrupacion(id);
                return StatusCode(200, audioList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpGet("all/{userId}")]
        public async Task<ActionResult<List<Agrupacion>>> GetAllAgrupacionAsync(long userId)
        {
            try
            {
                var agrupacionList = await _agrupacionService.GetAllAgrupacion(userId);
                return StatusCode(200, agrupacionList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult<Audio>> UpdateAgrupacionAsync([FromBody]Agrupacion agrupacion)
        {
            try
            {
                await _agrupacionService.UpdateAgrupacion(agrupacion);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Audio>> DeleteAgrupacionAsync(long id)
        {
            try
            {
                await _agrupacionService.DeleteAgrupacion(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPost("/add")]
        public async Task<ActionResult> AddAudioToAgrupaacion([FromBody]Agrupacion_Audio agrupacion_audio)
        {
            try
            {
                await _agrupacionService.AddAudioToAgrupacion(agrupacion_audio);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }
    }
}
