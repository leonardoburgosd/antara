using Antara.Model;
using Antara.Model.Contracts.Services;
using Antara.Model.Dtos;
using Antara.Model.Entities;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Upload;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Antara.API.Controllers
{
    [Route("api/album")]
    [ApiController]
    public class AlbumController : Controller
    {
        private readonly IGestionarAlbumService _gestionarAlbumService;
        private readonly IWebHostEnvironment _hostingEnv;
        private const string DirectoryId = "1eWGKxmVjUsvfH2PNpfO1N_CUT2A6SkM6";

        public AlbumController(IGestionarAlbumService gestionarAlbumService, IWebHostEnvironment hostingEnv)
        {
            _gestionarAlbumService = gestionarAlbumService;
            _hostingEnv = hostingEnv;
        }

        // url: "localhost:8080/api/grupo"
        [HttpPost]
        public async Task<ActionResult<AlbumDto>> CrearAlbumAsync([FromForm] CrearAgrupacionDto crearAlbumDto, [FromForm] IFormFile imagenDePortada)
        {
            try
            {
                Album albumNuevo = new()
                {
                    Id = Guid.NewGuid(),
                    Nombre = crearAlbumDto.Nombre,
                    Descripcion = crearAlbumDto.Descripcion,
                    FechaPublicacion = DateTime.Parse("1900-01-01"),
                    EstaPublicado = false,
                    UsuarioId = crearAlbumDto.UsuarioId,
                    EstaActivo = true
                };
                if (imagenDePortada == null)
                {
                    albumNuevo.PortadaUrl = null;
                }
                else
                {
                    var path = _hostingEnv.ContentRootPath;
                    var credentialsPath = Path.Combine(path, "credentials.json");
                    string url = await SubirArchivo(credentialsPath, imagenDePortada);
                    albumNuevo.PortadaUrl = url.Replace("&export=download", "");
                }
                await _gestionarAlbumService.CrearAlbum(albumNuevo);
                return CreatedAtAction("ObtenerAlbum", new { id = albumNuevo.Id }, albumNuevo.AsDto());
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
        public async Task<ActionResult<AlbumDto>> ObtenerAlbumAsync(Guid id)
        {
            try
            {
                var album = await _gestionarAlbumService.ObtenerAlbum(id);
                if (album == null)
                {
                    return NotFound();
                }
                return StatusCode(200, album.AsDto());
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpGet("todos/{userId}")]
        public async Task<ActionResult<List<AlbumDto>>> ObtenerTodosAlbumesDeUsuarioAsync(Guid userId)
        {
            try
            {
                var albumList = (await _gestionarAlbumService.ObtenerTodosAlbumesDeUsuario(userId)).Select(item => item.AsDto());
                return StatusCode(200, albumList);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPut]
        public async Task<ActionResult> EditarAlbumAsync(Guid id, EditarAgrupacionDto editarAlbumDto)
        {
            try
            {
                Album album = await _gestionarAlbumService.ObtenerAlbum(id);
                if (album == null)
                {
                    return NotFound();
                }
                Album albumEditado = album with
                {
                    Nombre = editarAlbumDto.Nombre,
                    Descripcion = editarAlbumDto.Descripcion,
                    PortadaUrl = editarAlbumDto.PortadaUrl
                };
                await _gestionarAlbumService.EditarAlbum(albumEditado);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarAlbumAsync(Guid id)
        {
            try
            {
                var grupo = await _gestionarAlbumService.ObtenerAlbum(id);
                if (grupo == null)
                {
                    return NotFound();
                }
                await _gestionarAlbumService.EliminarAlbum(id);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }

        [HttpPut("/publicar/{id}")]
        public async Task<ActionResult> PublicarAlbum(Guid id)
        {
            try
            {
                var grupo = await _gestionarAlbumService.ObtenerAlbum(id);
                if (grupo == null)
                {
                    return NotFound(id);
                }
                await _gestionarAlbumService.PublicarAlbum(grupo);
                return StatusCode(200);
            }
            catch (Exception err)
            {
                return StatusCode(500, err.Message);
            }
        }
        private static async Task<string> SubirArchivo(string credencialesDirectorio, IFormFile archivo)
        {
            try
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
                    var request = service.Files.Create(fileMetadata, fsSource, "image/jpeg");
                    request.Fields = "*";
                    var results = await request.UploadAsync(CancellationToken.None);
                    if (results.Status == UploadStatus.Failed)
                    {
                        throw new ArgumentException("Argumentos invalidos", nameof(archivo));
                    }
                    fileUrl = request.ResponseBody?.WebContentLink;
                }
                return fileUrl;
            }
            catch (Exception err)
            {
                Console.Write(err.Message.ToString());
                throw;
            }
        }
    }
}
