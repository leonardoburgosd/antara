using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/values")]
    [ApiController]
    public class ValuesController : Controller
    {
        [HttpGet]
        public async Task<JsonResult> Get() {
            return Json(0);
        }
    }
}
