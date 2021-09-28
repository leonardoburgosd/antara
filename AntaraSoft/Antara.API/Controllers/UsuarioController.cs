using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using Antara.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/usuario")]
    [ApiController]
    public class UsuarioController : Controller
    {
        private readonly IRegistrarUsuarioService registrarUsuarioService;
        private readonly ILoginService loginService;
        public UsuarioController(IRegistrarUsuarioService registrarUsuarioService, ILoginService loginService)
        {
            this.registrarUsuarioService = registrarUsuarioService;
            this.loginService = loginService;
        }

        // url: "localhost:8080/api/usuario"
        [HttpPost]
        public async Task<ActionResult> CreateUsuarioAsync([FromBody] Usuario usuario)
        {
            try
            {
                if (registrarUsuarioService.IsEmailValid(usuario.Email).Result)
                {
                    var newUsuario = await registrarUsuarioService.CreateUsuario(usuario);
                    return CreatedAtAction("GetUsuario", new { id = newUsuario.Id }, newUsuario);
                }
                throw new ArgumentException("Este correo electrónico ya esta siendo usado");
            }
            catch (Exception err)
            {
                if (err.Message.Contains("Este correo electrónico ya esta siendo usado"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                throw;
            }
        }

        // url: "localhost:8080/api/usuario/{id}"
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuarioAsync(long id)
        {
            try
            {
                Usuario usuario = await registrarUsuarioService.GetUsuario(id);
                if (usuario == null)
                    return NotFound();
                return usuario;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // url: "localhost:8080/api/usuario/login"
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> LoginAsync([FromBody] Authentication autenticacion)
        {
            try
            {
                Usuario user = await loginService.Login(autenticacion.email, autenticacion.password);
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