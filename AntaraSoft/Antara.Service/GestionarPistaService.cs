﻿using Antara.Model.Contracts;
using Antara.Model.Contracts.Services;
using Antara.Model.Entities;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Upload;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class GestionarPistaService : IGestionarPistaService
    {
        private const string PathToServiceAccountKeyFile = @"D:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\ServiceAccountCred.json";
        private const string DirectoryId = "1SiWueKfJRRXu1RCgm2ZhTlQxdcuN5Flz";
        
        private readonly IPistaRepository audioRepository;

        public GestionarPistaService(IPistaRepository audioRepository)
        {
            this.audioRepository = audioRepository;
        }

        public async Task<string> SubirArchivo(string path, string nombreArchivo)
        {
            //Cargar las credenciales de la cuenta de servicio y definir el alcance
            var credential = GoogleCredential.FromFile(PathToServiceAccountKeyFile)
                .CreateScoped(DriveService.ScopeConstants.Drive);
            //Crear un servicio drive
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential
            });
            //Subir metadata del archivo
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = nombreArchivo,
                Parents = new List<String>() { DirectoryId }
            };
            string fileUrl;
            //Crear nuevo archivo en Google Drive
            await using (var fsSource = new FileStream(path, FileMode.Open, FileAccess.Read))
            {
                //Crear un nuevo archivo, con metadata y stream.
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

        public async Task CrearPista(Pista audio)
        {
            try
            {
                if(EsUrlValido(audio.Url).Result)
                {
                    await audioRepository.CrearPista(audio);
                    return;
                }
                throw new ArgumentException("Esta direccion url ya se encuentra registrada.");
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public Task EliminarPista(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return EliminarPistaInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task EliminarPistaInner(Guid id)
        {
            await audioRepository.EliminarPista(id);
        }

        public async Task EditarPista(Pista audio)
        {
            try
            {
                if (EsUrlValido(audio.Url).Result)
                {
                    await audioRepository.EditarPista(audio);
                    return;
                }
                throw new ArgumentException("Esta direccion url ya se encuentra registrada.");
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        public Task<Pista> ObtenerPista(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return ObtenerPistaInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<Pista> ObtenerPistaInner(Guid id)
        {
            return await audioRepository.ObtenerPista(id);
        }

        public Task<List<Pista>> ObtenerTodosPistasDeGrupo(Guid agrupacionId)
        {
            try
            {
                if (agrupacionId == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(agrupacionId), "No se proporciono ningún valor");
                }
                return ObtenerTodosPistasDeGrupoInner(agrupacionId);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<List<Pista>> ObtenerTodosPistasDeGrupoInner(Guid agrupacionId)
        {
            return await audioRepository.ObtenerTodosPistasDeGrupo(agrupacionId);
        }

        public Task<bool> EsUrlValido(string url)
        {
            try
            {
                if (url == null)
                {
                    throw new ArgumentNullException(nameof(url), "No se proporciono ningún valor");
                }
                return EsUrlValidoInner(url);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<bool> EsUrlValidoInner(string url)
        {
            return await audioRepository.VerificarUrlUnico(url);
        }


        public Task<List<Pista>> BuscarPistas(string cadena)
        {
            try
            {
                if (cadena == null)
                {
                    throw new ArgumentNullException(nameof(cadena), "No se proporciono ningún valor");
                }
                return BuscarPistassInner(cadena);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }

        private async Task<List<Pista>> BuscarPistassInner(string cadena)
        {
            return await audioRepository.BuscarPistass(cadena);
        }

        public async Task ReproducirPista(Pista audio)
        {
            try
            {
                audio.AumentarReproduccion();
                await audioRepository.ReproducirPista(audio.Id, audio.Reproducciones);
            }
            catch (Exception err)
            {
                Console.Write(err.Message);
                throw;
            }
        }
    }
}
