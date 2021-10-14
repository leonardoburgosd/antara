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
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace Antara.API.Controllers
{
    [Route("api/pista")]
    [ApiController]
    public class PistaController : Controller
    {
        private readonly IGestionarPistaService _gestionarpistaService;
        private readonly IWebHostEnvironment _hostingEnv;
        public PistaController(IGestionarPistaService gestionarpistaService, IWebHostEnvironment hostingEnv)
        {
            _gestionarpistaService = gestionarpistaService;
            _hostingEnv = hostingEnv;
        }

        [HttpPost]
        public async Task<ActionResult<PistaDto>> CrearPistaAsync([FromForm]CrearPistaDto pistaDto,[FromForm] IFormFile archivo)
        {
            try
            {
                if(archivo == null)
                {
                    throw new ArgumentNullException(nameof(archivo));
                }
                var path = _hostingEnv.ContentRootPath;
                var fileName = Path.GetFileName(archivo.FileName);
                var filepath = Path.Combine(_hostingEnv.ContentRootPath, "pistas\\", fileName);
                using(var fileStream = new FileStream(filepath,FileMode.Create))
                {
                    await archivo.CopyToAsync(fileStream);
                }
                string url = await _gestionarpistaService.SubirArchivo(filepath, fileName);
                Pista pistaNueva = new()
                {
                    Id = Guid.NewGuid(),
                    Nombre = fileName,
                    FechaRegistro = DateTime.Now,
                    AnoCreacion = pistaDto.AnoCreacion,
                    Interprete = pistaDto.Interprete,
                    Compositor = pistaDto.Compositor,
                    Productor = pistaDto.Productor,
                    Reproducciones = 0,
                    GeneroId = pistaDto.GeneroId,
                    Url = url,
                    UsuarioId = pistaDto.UsuarioId
                };
                await _gestionarpistaService.CrearPista(pistaNueva);
                return CreatedAtAction("ObtenerPista", new { id = pistaNueva.Id }, pistaNueva.AsDto());
            }
            catch (Exception err)
            {
                if (err.Message.Contains("Esta direccion url ya se encuentra registrada")
                    || err.Message.Contains("No se pudo crear el pista"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                else return StatusCode(500, err);
            }
        }

        [HttpGet("todos/{grupoId}")]
        public async Task<ActionResult<List<PistaDto>>> ObtenerTodosPistasDeGrupoAsync(Guid grupoId)
        {
            try
            {
                var pistaList = (await _gestionarpistaService.ObtenerTodosPistasDeGrupo(grupoId)).Select(item => item.AsDto());
                return StatusCode(200, pistaList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PistaDto>> ObtenerPistaAsync(Guid id)
        {
            try
            {
                var pista = await _gestionarpistaService.ObtenerPista(id);
                if (pista == null)
                {
                    return NotFound();
                }
                return StatusCode(200, pista.AsDto());
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpPut]
        public async Task<ActionResult> EditarPistaAsync(Guid id, EditarPistaDto pistaDto)
        {
            try
            {
                var pista = await _gestionarpistaService.ObtenerPista(id);
                if (pista == null)
                {
                    return NotFound();
                }
                Pista pistaEditada = pista with
                {
                    Nombre = pistaDto.Nombre,
                    AnoCreacion = pistaDto.AnoCreacion,
                    Interprete = pistaDto.Interprete,
                    Compositor = pistaDto.Compositor,
                    Productor = pistaDto.Productor,
                    GeneroId = pistaDto.GeneroId,
                    Url = pistaDto.Url
                };
                await _gestionarpistaService.EditarPista(pistaEditada);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarPistaAsync(Guid id)
        {
            try
            {
                var pista = await _gestionarpistaService.ObtenerPista(id);
                if (pista == null)
                {
                    return NotFound();
                }
                await _gestionarpistaService.EliminarPista(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpGet("/buscar")]
        public async Task<ActionResult<List<PistaDto>>> SearchpistaAsync([Bind(Prefix = "cadena")] string cadena)
        {
            try
            {
                var pistaLista = (await _gestionarpistaService.BuscarPistas(cadena)).Select(item => item.AsDto());
                return StatusCode(200, pistaLista);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }
        [HttpPut("/reproducir/{id}")]
        public async Task<ActionResult> ReproducirPista(Guid id)
        {
            try
            {
                var pista = await _gestionarpistaService.ObtenerPista(id);
                if(pista == null)
                {
                    return NotFound();
                }
                await _gestionarpistaService.ReproducirPista(pista);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }
    }
}
