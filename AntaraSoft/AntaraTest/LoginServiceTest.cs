﻿using Antara.Model;
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
    public class LoginServiceTest
    {
        [TestMethod]
        [DataRow("test@correo.com")]
        [DataRow("testLogin123@correo.com")]
        [DataRow(null)]
        public void LoginTest(string emailLogin)
        {
            var password = "123456";
            var encryptedPassword = BCryptNet.HashPassword(password);
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var usuarioRepo = new UsuarioRepository(dapper);
            var mockEncrypter = new Mock<IEncryptText>();
            mockEncrypter.Setup(x => x.CompararHash(password, usuarioRepo.GetUsuario(Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E")).Result.Password)).Returns(true);
            var servicioLogin = new LoginService(usuarioRepo, mockEncrypter.Object);

            

            if(emailLogin != null)
            {
                var actual = servicioLogin.Login(emailLogin, password).Result;
                if (actual != null)
                {
                    Assert.IsNotNull(actual.Id);
                    Assert.AreEqual("test@correo.com", actual.Email);
                    Assert.IsTrue(BCryptNet.Verify(password, actual.Password));
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
            else{
                Assert.ThrowsException<ArgumentNullException>(() =>
                {
                    var actual = servicioLogin.Login(emailLogin, password).Result;
                });
            }
        }
    }
}
