using Antara.Model.Contracts;
using Antara.Model.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : Controller
    {
        private readonly IUsuarioServices usuarioServices;
        public UsuarioController(IUsuarioServices usuarioServices)
        {
            this.usuarioServices = usuarioServices;
        }

        // POST /api/usuario
        [HttpPost]
        public async Task<ActionResult> CreateUsuario([FromBody] Usuario usuario)
        {
            try
            {
                await usuarioServices.CreateUsuario(usuario);
                return Ok();
            }
            catch (Exception err)
            {
                throw err;
            }
        }

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

        // GET /api/usuario/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(long id)
        {
            try
            {
                Usuario usuario = await usuarioServices.GetUsuario(id);
                if (usuario == null)
                    return NotFound();
                return usuario;
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

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] object autenticacion)
        {
            try
            {
                dynamic autenticacionConvert = JsonConvert.DeserializeObject(autenticacion.ToString());
                Usuario user = await usuarioServices.Login((string)autenticacionConvert.email, (string)autenticacionConvert.password);
                return Json(new { user.Email, user.Name, user.BirthDate, user.Gender, user.RegistrationDate, user.Country });
            }
            catch(ApplicationException ae)
            {
                return  StatusCode(401,Json(new { error= ae.Message}));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}