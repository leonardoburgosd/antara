using Antara.Model;
using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
using Antara.Model.Dtos;
using Antara.Model.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/usuario")]
    [ApiController]
    public class UsuarioController : Controller
    {
        private readonly IRegistrarUsuarioService _registrarUsuarioService;
        private readonly ILoginService _loginService;
        public UsuarioController(IRegistrarUsuarioService registrarUsuarioService, ILoginService loginService)
        {
            _registrarUsuarioService = registrarUsuarioService;
            _loginService = loginService;
        }

        // url: "localhost:8080/api/usuario"
        [HttpPost]
        public async Task<ActionResult<UsuarioDto>> CrearUsuarioAsync([FromBody] CrearUsuarioDto usuarioDto)
        {
            try
            {
                Usuario usuarioNuevo = new()
                {
                    Id = Guid.NewGuid(),
                    Email = usuarioDto.Email,
                    Password = usuarioDto.Password,
                    Nombre = usuarioDto.Nombre,
                    FechaNacimiento = usuarioDto.FechaNacimiento,
                    Genero = usuarioDto.Genero,
                    EstaActivo = true,
                    FechaRegistro = DateTime.Now,
                    Pais = usuarioDto.Pais
                };
                await _registrarUsuarioService.CrearUsuario(usuarioNuevo);
                return CreatedAtAction("ObtenerUsuario", new { id = usuarioNuevo.Id }, usuarioNuevo.AsDto());
            }
            catch (Exception err)
            {
                if (err.Message.Contains("Este correo electrónico ya esta siendo usado")
                    || err.Message.Contains("No se pudo crear el usuario"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                else return StatusCode(500, err);
            }
        }

        // url: "localhost:8080/api/usuario/{id}"
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDto>> ObtenerUsuarioAsync(Guid id)
        {
            try
            {
                Usuario usuario = await _registrarUsuarioService.ObtenerUsuario(id);
                if (usuario == null)
                    return NotFound();
                return StatusCode(200, usuario.AsDto());
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        // url: "localhost:8080/api/usuario/login"
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginAsync([FromBody] LoginUsuarioDto loginDto)
        {
            try
            {
                Usuario usuario = await _loginService.Login(loginDto.Email, loginDto.Password);
                if(usuario == null)
                {
                    return NotFound();
                }
                return Json(new { usuario.Email, usuario.Nombre, usuario.FechaNacimiento, usuario.Genero, usuario.FechaRegistro, usuario.Pais });
            }
            catch (Exception err)
            {
                if(err.Message.Contains("Correo electrónico")){
                    return StatusCode(401, Json(new { error = err.Message }));
                }
                throw;
            }
        }
    }
}