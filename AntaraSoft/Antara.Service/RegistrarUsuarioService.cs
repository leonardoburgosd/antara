using Antara.Model.Contracts;
using Antara.Model.Contracts.Repository;
using Antara.Model.Entities;
using Antara.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Service
{
    public class RegistrarUsuarioService : IRegistrarUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepo;
        private readonly IPlaylistRepository _playlistRepo;
        private readonly IEncryptText _encryptText;

        public RegistrarUsuarioService(IUsuarioRepository usuarioRepo, IEncryptText encryptText, IPlaylistRepository playlistRepo)
        {
            _usuarioRepo = usuarioRepo;
            _playlistRepo = playlistRepo;
            _encryptText = encryptText;
        }

        public async Task CrearUsuario(Usuario usuario)
        {
            try
            {
                if (usuario.Tipo.ToLower() == "antara" || usuario.Tipo.ToLower() == "google")
                {
                    if (EsEmailValido(usuario.Email).Result)
                    {
                        if (usuario.Tipo.ToLower() == "antara")
                        {
                            usuario.Password = _encryptText.GeneratePasswordHash(usuario.Password);
                        }
                        Playlist playlistPorDefecto = new()
                        {
                            Id = Guid.NewGuid(),
                            Nombre = "Tus me gusta",
                            Descripcion = "Hecho por ti y para ti. Cargado de tu propio estilo.",
                            EstaActivo = true,
                            PortadaUrl = null,
                            UsuarioId = usuario.Id,
                            FechaRegistro = DateTime.Now
                        };
                        var crearUsuarioPendiendte = Task.Run(() => _usuarioRepo.CrearUsuario(usuario));
                        crearUsuarioPendiendte.Wait();
                        if (crearUsuarioPendiendte.IsCompletedSuccessfully) {
                            await _playlistRepo.CrearPlaylist(playlistPorDefecto);
                        }
                        else
                        {
                            throw new AggregateException("No se pudo registrar al usuario");
                        }

                    }
                    else
                    {
                        if (usuario.Tipo.ToLower() == "antara")
                        {
                            throw new ArgumentException("Este correo electrónico ya se encuentra registrado.");
                        }
                    }
                }
                
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        public Task<Usuario> ObtenerUsuario(Guid id)
        {
            try
            {
                if (id == Guid.Empty)
                {
                    throw new ArgumentNullException(nameof(id), "No se proporciono ningún valor");
                }
                return ObtenerUsuarioInner(id);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Usuario> ObtenerUsuarioInner(Guid id)
        {
            return await _usuarioRepo.ObtenerUsuario(id);
        }

        public Task<bool> EsEmailValido(string email)
        {
            try
            {
                if (email == null)
                {
                    throw new ArgumentNullException(nameof(email), "No se proporciono ningún valor");
                }
                return EsEmailValidoInner(email);
            }
            catch (Exception err)
            {
                Console.Write(err);
                throw;
            }
        }

        private async Task<Boolean> EsEmailValidoInner(string email)
        {
            return await _usuarioRepo.VerificarEmailUnico(email);
        }
    }
}
