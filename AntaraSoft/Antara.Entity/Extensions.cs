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
                Name = usuario.Name,
                BirthDate = usuario.BirthDate,
                Gender = usuario.Gender,
                RegistrationDate = usuario.RegistrationDate,
                Country = usuario.Country
            };
        }
        public static AudioDto AsDto(this Audio audio)
        {
            return new AudioDto
            {
                Id = audio.Id,
                Name = audio.Name,
                RegistrationDate = audio.RegistrationDate,
                CreationYear = audio.CreationYear,
                Interpreter = audio.Interpreter,
                Writer = audio.Writer,
                Producer = audio.Producer,
                Reproductions = audio.Reproductions,
                Genero_id = audio.Genero_id,
                Url = audio.Url,
                User_id = audio.User_id
            };
        }

        public static AgrupacionDto AsDto(this Agrupacion agrupacion)
        {
            return new AgrupacionDto
            {
                Id = agrupacion.Id,
                Name = agrupacion.Name,
                Description = agrupacion.Description,
                PublicationDate = agrupacion.PublicationDate,
                IsPublished = agrupacion.IsPublished,
                Type = agrupacion.Type,
                User_id = agrupacion.User_id
            };
        }
    }
}
