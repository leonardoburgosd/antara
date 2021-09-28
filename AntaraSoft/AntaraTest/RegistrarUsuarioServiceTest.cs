using Antara.Model;
using Antara.Model.Contracts;
using Antara.Model.Entities;
using Antara.Repository.Dapper;
using Antara.Repository.Repositories;
using Antara.Security;
using Antara.Service;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BCryptNet = BCrypt.Net.BCrypt;

namespace AntaraTest
{
    [TestClass]
    public class RegistrarUsuarioServiceTest
    {

        [TestMethod]
        public void CreateUsuarioTest()
        {
            Usuario esperado = new("test@correo.com", "test123", "Test", new(1999, 12, 31), 'M', "Peru");
            esperado.Email = "test@correo.com";
            var password = "test123";
            esperado.Password = password;
            esperado.Name = "Test";
            esperado.BirthDate = new(1999, 12, 31);
            esperado.Gender = 'M';
            esperado.Country = "Peru";

            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);
            var mockEncrypter = new Mock<IEncryptText>();
            mockEncrypter.Setup(x => x.GeneratePasswordHash(esperado.Password)).Returns(BCryptNet.HashPassword(esperado.Password));
            var servicio = new RegistrarUsuarioService(usuarioRepo,mockEncrypter.Object);
            
            var actual = servicio.CreateUsuario(esperado).Result;

            Assert.IsNotNull(actual.Id);
            Assert.AreEqual(esperado.Email, actual.Email);
            Assert.IsTrue(BCryptNet.Verify(password,actual.Password));
            Assert.AreEqual(esperado.Name, actual.Name);
            Assert.AreEqual(esperado.BirthDate, actual.BirthDate);
            Assert.AreEqual(esperado.Gender, actual.Gender);
            Assert.IsNotNull(actual.RegistrationDate);
            Assert.IsTrue(actual.Active);
            Assert.AreEqual(esperado.Country, actual.Country);

            
        }
    }
}
