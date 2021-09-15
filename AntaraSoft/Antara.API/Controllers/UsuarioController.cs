using Antara.Model.Contracts;
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
    public class UsuarioController : Controller
    {
        private readonly IUsuario usuarioRepo;
        public UsuarioController( IUsuario usuarioRepo)
        {
            this.usuarioRepo = usuarioRepo;
        }

        // POST /api/usuario
        [HttpPost]
        public async Task<ActionResult> CreateUsuario([FromBody] Usuario usuario)
        {
            try
            {
               await usuarioRepo.CreateUsuario(usuario);
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
                var listaUsuarios = await usuarioRepo.GetUsuario();
                return listaUsuarios;
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
                var usuario = await usuarioRepo.GetUsuario(id);
                if(usuario == null)
                {
                    return NotFound();
                }
                return usuario ;
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
                await usuarioRepo.UpdateUsuario(usuario);
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
                await usuarioRepo.DeleteUsuario(id);
                return Ok();
            }
            catch (Exception err)
            {
                throw err;
            }
        }
    }
}
