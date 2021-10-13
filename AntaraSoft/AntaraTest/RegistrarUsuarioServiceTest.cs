using Antara.Model;
using Antara.Model.Entities;
using Antara.Repository.Repositories;
using Antara.Security;
using Antara.Service;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using BCryptNet = BCrypt.Net.BCrypt;

namespace AntaraTest
{
    [TestClass]
    public class RegistrarUsuarioServiceTest
    {
        public RegistrarUsuarioServiceTest()
        {

        }
        [TestMethod]
        [DataRow("testCreate@correo.com", 0)]
        [DataRow("test@correo.com", 1)]
        [DataRow(null, 1)]
        [DataRow("testCreate@correo.com", 2)]
        public void CreateUsuarioTest(string email, int caso)
        {
            Usuario esperado = new()
            {
                Id = Guid.NewGuid(),
                Email = email,
                Password = "test123",
                Name = "Test",
                BirthDate = new(1999, 12, 31),
                Gender = 'M',
                Active = true,
                RegistrationDate = DateTime.Now,
                Country = "Peru"
            };

            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);
            var mockEncrypter = new Mock<IEncryptText>();
            mockEncrypter.Setup(x => x.GeneratePasswordHash(esperado.Password)).Returns(BCryptNet.HashPassword(esperado.Password));
            var servicio = new RegistrarUsuarioService(usuarioRepo,mockEncrypter.Object);

            switch (caso)
            {
                case 0:
                    servicio.CreateUsuario(esperado).Wait();
                    Usuario actual = servicio.GetUsuario(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Email, actual.Email);
                        Assert.IsTrue(BCryptNet.Verify("test123", actual.Password));
                        Assert.AreEqual(esperado.Name, actual.Name);
                        Assert.AreEqual(esperado.BirthDate, actual.BirthDate);
                        Assert.AreEqual(esperado.Gender, actual.Gender);
                        Assert.IsNotNull(actual.RegistrationDate);
                        Assert.IsTrue(actual.Active);
                        Assert.AreEqual(esperado.Country, actual.Country);

                        usuarioRepo.PhysicalDeleteUsuario(actual.Id).Wait();
                    }
                    break;

                case 1:
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        servicio.CreateUsuario(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Name = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        servicio.CreateUsuario(esperado).Wait();
                    });
                    break;
            }   
        }

        [TestMethod]
        public void GetUsuarioTests()
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);
            var mockEncrypter = new Mock<IEncryptText>();
            var servicio = new RegistrarUsuarioService(usuarioRepo, mockEncrypter.Object);

            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                var actual = servicio.GetUsuario(Guid.Empty).Result;
            });
            
        }

        [TestMethod]
        public void PhysicalDeleteUsuarioTest()
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);

            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                usuarioRepo.PhysicalDeleteUsuario(Guid.Empty).Wait();
            });
        }
    }
}
