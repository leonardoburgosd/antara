using Antara.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        [HttpPost]
        public async Task<ActionResult> create([FromBody] usuarios usuario)
        {
            try
            {
                return Ok(usuario);
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
