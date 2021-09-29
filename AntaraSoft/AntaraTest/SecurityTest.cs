using Antara.Security;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AntaraTest
{
    [TestClass]
    public class SecurityTest
    {

        [TestMethod]
        [DataRow("hola mundo", true)]
        [DataRow("hello world", false)]
        public void CompararHashText(string texto, bool esperado)
        {
            EncryptText encriptador = new();
            var textoNoEncriptado = "hola mundo";
            var textoEncriptado = encriptador.GeneratePasswordHash(textoNoEncriptado);

            
            var actual = encriptador.CompararHash(texto, textoEncriptado);

            Assert.AreEqual(esperado, actual);
        }
    }
}
