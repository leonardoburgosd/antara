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

        // POST /api/usuario
        [HttpPost]
        public async Task<ActionResult> CreateUsuario([FromBody] Usuario usuario)
        {
            try
            {
                var newUsuario = await registrarUsuarioService.CreateUsuario(usuario);
                return CreatedAtAction(nameof(GetUsuario), new { id = newUsuario.Id }, newUsuario);
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        // GET /api/usuario/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(long id)
        {
            try
            {
                Usuario usuario = await registrarUsuarioService.GetUsuario(id);
                if (usuario == null)
                    return NotFound();
                return usuario;
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        // POST /api/usuario/login
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] object autenticacion)
        {
            try
            {
                dynamic autenticacionConvert = JsonConvert.DeserializeObject(autenticacion.ToString());
                Usuario user = await loginService.Login((string)autenticacionConvert.email, (string)autenticacionConvert.password);
                return Json(new { user.Email, user.Name, user.BirthDate, user.Gender, user.RegistrationDate, user.Country });
            }
            catch (ApplicationException ae)
            {
                return StatusCode(401, Json(new { error = ae.Message }));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        /*
        // GET /api/usuario
        [HttpGet]
        public async Task<IEnumerable<Usuario>> GetUsuario()
        {
            try
            {
                return await usuarioServices.GetUsuario();
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        

        // PUT /api/usuario
        [HttpPut]
        public async Task<ActionResult> UpddateUsuario(Usuario usuario)
        {
            try
            {
                await usuarioServices.UpdateUsuario(usuario);
                return Ok();
            }
            catch (Exception err)
            {
                throw;
            }
        }

        // DELETE api/usuario/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUsuario(long id)
        {
            try
            {
                await usuarioServices.DeleteUsuario(id);
                return Ok();
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        */
    }
}