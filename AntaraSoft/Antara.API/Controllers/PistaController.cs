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
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using System.Threading;
using Google.Apis.Upload;

namespace Antara.API.Controllers
{
    [Route("api/pista")]
    [ApiController]
    public class PistaController : Controller
    {
        private readonly IGestionarPistaService _gestionarPistaService;
        private readonly IWebHostEnvironment _hostingEnv;
        private const string DirectoryId = "1hWAXKy5ZW8Y4A9ch93EmMzAfC8pyeDbd";

        public PistaController(IGestionarPistaService gestionarpistaService, IWebHostEnvironment hostingEnv)
        {
            _gestionarPistaService = gestionarpistaService;
            _hostingEnv = hostingEnv;
        }

        [HttpPost]
        public async Task<ActionResult<PistaDto>> CrearPistaAsync([FromForm]CrearPistaDto pistaDto,[FromForm] IFormFile archivo)
        {
            try
            {
                if (archivo == null)
                {
                    throw new ArgumentNullException(nameof(archivo));
                }
                Pista pistaNueva = new()
                {
                    Id = Guid.NewGuid(),
                    Nombre = Path.GetFileNameWithoutExtension(archivo.FileName),
                    FechaRegistro = DateTime.Now,
                    AnoCreacion = pistaDto.AnoCreacion,
                    Interprete = pistaDto.Interprete,
                    Compositor = pistaDto.Compositor,
                    Productor = pistaDto.Productor,
                    Reproducciones = 0,
                    GeneroId = pistaDto.GeneroId,
                    AlbumId = pistaDto.AlbumId,
                    EstaActivo = true
                };
                if(_gestionarPistaService.SonDatosValidos(pistaNueva))
                {
                    var path = _hostingEnv.ContentRootPath;
                    var credentialsPath = Path.Combine(path, "credentials.json");
                    string url = await SubirArchivo(credentialsPath, archivo);
                    if (url != null)
                    {
                        pistaNueva.Url = url.Replace("&export=download", "");
                        await _gestionarPistaService.CrearPista(pistaNueva);
                        return CreatedAtAction("ObtenerPista", new { id = pistaNueva.Id }, pistaNueva.AsDto());
                    }
                    throw new ArgumentNullException(nameof(url), "No se proporciono ningún valor");
                }
                throw new ArgumentException("Argumentos invalidos", nameof(pistaDto));
            }
            catch (Exception err)
            {
                if (err.Message.Contains("No se pudo crear la pista"))
                {
                    return StatusCode(409, Json(new { error = err.Message }));
                }
                else return StatusCode(500, err.Message.ToString());
            }
        }

        [HttpGet("todos/album/{AlbumId}")]
        public async Task<ActionResult<List<PistaDto>>> ObtenerTodosPistasDeAlbumAsync(Guid AlbumId)
        {
            try
            {
                var pistasList = (await _gestionarPistaService.ObtenerTodosPistasDeAlbum(AlbumId)).Select(item => item.AsDto());
                return StatusCode(200, pistasList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        [HttpGet("todos/playlist/{PlaylistId}")]
        public async Task<ActionResult<List<PistaDto>>> ObtenerTodosPistasDePlaylistAsync(Guid PlaylistId)
        {
            try
            {
                var pistasList = (await _gestionarPistaService.ObtenerTodosPistasDePlaylist(PlaylistId)).Select(item => item.AsDto());
                return StatusCode(200, pistasList);
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
                var pista = await _gestionarPistaService.ObtenerPista(id);
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
                var pista = await _gestionarPistaService.ObtenerPista(id);
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
                };
                await _gestionarPistaService.EditarPista(pistaEditada);
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
                var pista = await _gestionarPistaService.ObtenerPista(id);
                if (pista == null)
                {
                    return NotFound();
                }
                await _gestionarPistaService.EliminarPista(id);
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
                var pistaLista = (await _gestionarPistaService.BuscarPistas(cadena)).Select(item => item.AsDto());
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
                var pista = await _gestionarPistaService.ObtenerPista(id);
                if(pista == null)
                {
                    return NotFound();
                }
                await _gestionarPistaService.ReproducirPista(pista);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err);
            }
        }

        private static async Task<string> SubirArchivo(string credencialesDirectorio, IFormFile archivo)
        {
            //Cargar las credenciales de la cuenta de servicio y definir el alcance
            var credential = GoogleCredential.FromFile(credencialesDirectorio)
                .CreateScoped(DriveService.ScopeConstants.Drive);
            //Crear un servicio drive
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential
            });
            //Subir metadata del archivo
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = archivo.FileName,
                Parents = new List<String>() { DirectoryId }
            };
            string fileUrl;
            //Crear nuevo archivo en Google Drive
            await using (var fsSource = new MemoryStream())
            {
                //Crear un nuevo archivo, con metadata y stream.
                await archivo.CopyToAsync(fsSource);
                var request = service.Files.Create(fileMetadata, fsSource, "audio/mpeg");
                request.Fields = "*";
                var results = await request.UploadAsync(CancellationToken.None);
                if (results.Status == UploadStatus.Failed)
                {
                    Console.WriteLine($"Error subiendo el archivo: {results.Exception.Message}");
                }
                fileUrl = request.ResponseBody?.WebContentLink;
            }
            return fileUrl;
        }
    }
}
