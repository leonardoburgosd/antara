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
    [Route("api/grupo")]
    [ApiController]
    public class GrupoController : Controller
    {
        private readonly IGestionarGrupoService _grupoService;

        public GrupoController(IGestionarGrupoService grupoService)
        {
            _grupoService = grupoService;
        }

        // url: "localhost:8080/api/grupo"
        [HttpPost]
        public async Task<ActionResult<GrupoDto>> CrearGrupoAsync([FromBody] CrearGrupoDto crearGrupoDto)
        {
            try
            {
                Grupo grupoNuevo = new()
                {
                    Id = Guid.NewGuid(),
                    Nombre = crearGrupoDto.Nombre,
                    Descripcion = crearGrupoDto.Descripcion,
                    FechaPublicacion = DateTime.Parse("1900-01-01"),
                    EstaPublicado = false,
                    Tipo = crearGrupoDto.Tipo,
                    UsuarioId = crearGrupoDto.UsuarioId
                };
                await _grupoService.CrearGrupo(grupoNuevo);
                return CreatedAtAction("ObtenerGrupo", new { id = grupoNuevo.Id }, grupoNuevo.AsDto());
            }
            catch (Exception err)
            {
                if (err.Message.Contains("No se pudo crear el grupo"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                else return StatusCode(500, err.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GrupoDto>> ObtenerGrupoAsync(Guid id)
        {
            try
            {
                var grupo = await _grupoService.ObtenerGrupo(id);
                if (grupo == null)
                {
                    return NotFound();
                }
                return StatusCode(200, grupo.AsDto());
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpGet("todos/{userId}")]
        public async Task<ActionResult<List<GrupoDto>>> ObtenerTodosGruposDeUsuarioAsync(Guid userId)
        {
            try
            {
                var grupoList = (await _grupoService.ObtenerTodosGruposDeUsuario(userId)).Select(item => item.AsDto());
                return StatusCode(200, grupoList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult> EditarGrupoAsync(Guid id, EditarGrupoDto editarGrupoDto)
        {
            try
            {
                Grupo grupo = await _grupoService.ObtenerGrupo(id);
                if (grupo == null)
                {
                    return NotFound();
                }
                Grupo grupoEditado = grupo with
                {
                    Nombre = editarGrupoDto.Nombre,
                    Descripcion = editarGrupoDto.Descripcion,
                    EstaPublicado = editarGrupoDto.EstaPublicado,
                    Tipo = editarGrupoDto.Tipo
                };
                await _grupoService.EditarGrupo(grupoEditado);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarGrupoAsync(Guid id)
        {
            try
            {
                var grupo = await _grupoService.ObtenerGrupo(id);
                if (grupo == null)
                {
                    return NotFound();
                }
                await _grupoService.EliminarGrupo(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPost("/agregar")]
        public async Task<ActionResult> AgregarPistaAGrupo(GrupoPista grupoPista)
        {
            try
            {

                var grupo = await _grupoService.ObtenerGrupo(grupoPista.GrupoId);
                if(grupo == null)
                {
                    return NotFound(grupoPista.GrupoId);
                }
                await _grupoService.AgregarPistaAGrupo(grupoPista);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpDelete("/quitar")]
        public async Task<ActionResult> QuitarPistaDeGrupo(GrupoPista grupoPista)
        {
            try
            {
                var grupo = await _grupoService.ObtenerGrupo(grupoPista.GrupoId);
                if (grupo == null)
                {
                    return NotFound(grupoPista.GrupoId);
                }
                await _grupoService.QuitarPistaDeGrupo(grupoPista);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPut("/publicar/{id}")]
        public async Task<ActionResult> PublicarGrupo(Guid id)
        {
            try
            {
                var grupo = await _grupoService.ObtenerGrupo(id);
                if (grupo == null)
                {
                    return NotFound(id);
                }
                await _grupoService.PublicarGrupo(grupo);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }
    }
}
