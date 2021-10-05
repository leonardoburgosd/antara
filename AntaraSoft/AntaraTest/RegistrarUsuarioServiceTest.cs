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

        [TestMethod]
        [DataRow("testCreate@correo.com", 0)]
        [DataRow("testLogin@correo.com", 1)]
        [DataRow(null, 1)]
        [DataRow("testCreate@correo.com", 2)]
        public void CreateUsuarioTest(string email, int caso)
        {
            Usuario esperado = new(email, "test123", "Test", new(1999, 12, 31), 'M', "Peru");
            var password = "test123";


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
                    var actual = servicio.CreateUsuario(esperado).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Email, actual.Email);
                        Assert.IsTrue(BCryptNet.Verify(password, actual.Password));
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
                        var actual = servicio.CreateUsuario(esperado).Result;
                    });
                    break;
                case 2:
                    esperado.Name = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        var actual = servicio.CreateUsuario(esperado).Result;
                    });
                    break;
            }   
        }

        [TestMethod]
        [DataRow(10192L, 0)]
        [DataRow(1L, 0)]
        [DataRow(null, 1)]
        public void GetUsuarioTests(long id, int caso)
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);
            var mockEncrypter = new Mock<IEncryptText>();
            var servicio = new RegistrarUsuarioService(usuarioRepo, mockEncrypter.Object);

            if(caso == 0)
            {
                var actual = servicio.GetUsuario(id).Result;
                if (actual != null)
                {
                    Assert.IsNotNull(actual.Id);
                    Assert.AreEqual("testGet@correo.com", actual.Email);
                    Assert.IsTrue(BCryptNet.Verify("test123", actual.Password));
                    Assert.AreEqual("Test", actual.Name);
                    Assert.AreEqual('M', actual.Gender);
                    Assert.IsTrue(actual.Active);
                    Assert.AreEqual("Peru", actual.Country);
                }
                else
                {
                    Assert.IsNull(actual);
                }
            }
            else
            {
                Assert.ThrowsException<AggregateException>(() =>
                {
                    var actual = servicio.GetUsuario(id).Result;
                });
            }
        }
        /*
        [TestMethod]
        [DataRow("testEmail@correo.com", false)]
        [DataRow("testEmail1@correo.com", true)]
        [DataRow(null,false)]
        public void IsEmailValidTest(string email, bool esperado)
        {
            Usuario usuario1 = new("testEmail@correo.com", "usuario1", "Usuario1", new(1999, 12, 31), 'M', "Peru");
          
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);
            var mockEncrypter = new Mock<IEncryptText>();
            mockEncrypter.Setup(x => x.GeneratePasswordHash(usuario1.Password)).Returns(BCryptNet.HashPassword(usuario1.Password));
            var servicio = new RegistrarUsuarioService(usuarioRepo, mockEncrypter.Object);

            var usuario1Creado = servicio.CreateUsuario(usuario1).Result;

            if(email != null)
            {
                bool actual = servicio.IsEmailValid(email).Result;

                Assert.AreEqual(esperado, actual);

                usuarioRepo.PhysicalDeleteUsuario(usuario1Creado.Id).Wait();
            }
            else
            {
                Assert.ThrowsException<AggregateException>(() =>
                {
                    bool actual = servicio.IsEmailValid(email).Result;
                });
            }
        }
        */
    }
}
