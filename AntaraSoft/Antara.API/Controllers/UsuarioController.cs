using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
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
        public async Task<ActionResult> CreateUsuarioAsync([FromBody] Usuario usuario)
        {
            try
            {
                var newUsuario = await _registrarUsuarioService.CreateUsuario(usuario);
                return CreatedAtAction("GetUsuario", new { id = newUsuario.Id }, newUsuario);
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
        public async Task<ActionResult<Usuario>> GetUsuarioAsync(long id)
        {
            try
            {
                Usuario usuario = await _registrarUsuarioService.GetUsuario(id);
                if (usuario == null)
                    return NotFound();
                return StatusCode(200, usuario);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        // url: "localhost:8080/api/usuario/login"
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginAsync([FromBody] Authentication autenticacion)
        {
            try
            {
                Usuario user = await _loginService.Login(autenticacion.email, autenticacion.password);
                return Json(new { user.Email, user.Name, user.BirthDate, user.Gender, user.RegistrationDate, user.Country });
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