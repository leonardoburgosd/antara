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
        public async Task<ActionResult<AgrupacionDto>> CreateAgrupacionAsync([FromBody] CreateAgrupacionDto agrupacionDto)
        {
            try
            {
                Agrupacion newAgrupacion = new()
                {
                    Id = Guid.NewGuid(),
                    Name = agrupacionDto.Name,
                    Description = agrupacionDto.Description,
                    PublicationDate = DateTime.Parse("1900-01-01"),
                    IsPublished = false,
                    Type = agrupacionDto.Type,
                    User_id = agrupacionDto.User_id
                };
                await _agrupacionService.CreateAgrupacion(newAgrupacion);
                return CreatedAtAction("GetAgrupacion", new { id = newAgrupacion.Id }, newAgrupacion.AsDto());
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
        public async Task<ActionResult<AgrupacionDto>> GetAgrupacionAsync(Guid id)
        {
            try
            {
                var agrupacion = await _agrupacionService.GetAgrupacion(id);
                if (agrupacion == null)
                {
                    return NotFound();
                }
                return StatusCode(200, agrupacion.AsDto());
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpGet("all/{userId}")]
        public async Task<ActionResult<List<AgrupacionDto>>> GetAllAgrupacionAsync(Guid userId)
        {
            try
            {
                var agrupacionList = (await _agrupacionService.GetAllAgrupacion(userId)).Select(item => item.AsDto());
                return StatusCode(200, agrupacionList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult> UpdateAgrupacionAsync(Guid id, UpdateAgrupacionDto agrupacionDto)
        {
            try
            {
                Agrupacion existingAgrupacion = await _agrupacionService.GetAgrupacion(id);
                if (existingAgrupacion == null)
                {
                    return NotFound();
                }
                Agrupacion updatedAgrupacion = existingAgrupacion with
                {
                    Name = agrupacionDto.Name,
                    Description = agrupacionDto.Description,
                    IsPublished = agrupacionDto.IsPublished,
                    Type = agrupacionDto.Type,
                };
                await _agrupacionService.UpdateAgrupacion(updatedAgrupacion);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAgrupacionAsync(Guid id)
        {
            try
            {
                var existingAgrupacion = await _agrupacionService.GetAgrupacion(id);
                if (existingAgrupacion == null)
                {
                    return NotFound();
                }
                await _agrupacionService.DeleteAgrupacion(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPost("/add")]
        public async Task<ActionResult> AddAudioToAgrupacion([FromBody]Agrupacion_Audio agrupacion_audio)
        {
            try
            {

                var existingAgrupacion = await _agrupacionService.GetAgrupacion(agrupacion_audio.Agrupacion_id);
                if(existingAgrupacion == null)
                {
                    return NotFound(agrupacion_audio.Agrupacion_id);
                }
                await _agrupacionService.AddAudioToAgrupacion(agrupacion_audio);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpDelete("/remove")]
        public async Task<ActionResult> RemoveAudioFromAgrupaacion(Guid agrupacionId, Guid audioId)
        {
            try
            {
                var existingAgrupacion = await _agrupacionService.GetAgrupacion(agrupacionId);
                if (existingAgrupacion == null)
                {
                    return NotFound(agrupacionId);
                }
                await _agrupacionService.RemoveAudioFromAgrupacion(agrupacionId, audioId);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }
    }
}
