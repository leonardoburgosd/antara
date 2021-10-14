using Antara.Model.Dtos;
using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model
{
    public static class Extensions
    {
        public static UsuarioDto AsDto(this Usuario usuario)
        {
            return new UsuarioDto
            {
                Id = usuario.Id,
                Email = usuario.Email,
                Nombre = usuario.Nombre,
                FechaNacimiento = usuario.FechaNacimiento,
                Genero = usuario.Genero,
                FechaRegistro = usuario.FechaRegistro,
                Pais = usuario.Pais
            };
        }
        public static PistaDto AsDto(this Pista audio)
        {
            return new PistaDto
            {
                Id = audio.Id,
                Nombre = audio.Nombre,
                FechaRegistro = audio.FechaRegistro,
                AnoCreacion = audio.AnoCreacion,
                Interprete = audio.Interprete,
                Compositor = audio.Compositor,
                Productor = audio.Productor,
                Reproducciones = audio.Reproducciones,
                GeneroId = audio.GeneroId,
                Url = audio.Url,
                UsuarioId = audio.UsuarioId
            };
        }

        public static GrupoDto AsDto(this Grupo agrupacion)
        {
            return new GrupoDto
            {
                Id = agrupacion.Id,
                Nombre = agrupacion.Nombre,
                Descripcion = agrupacion.Descripcion,
                FechaPublicacion = agrupacion.FechaPublicacion,
                EstaPublicado = agrupacion.EstaPublicado,
                Tipo = agrupacion.Tipo,
                UsuarioId = agrupacion.UsuarioId
            };
        }
    }
}
