using Antara.Model.Contracts;
using Antara.Model.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

namespace AntaraTest
{
    [TestClass]
    public class TestUsuario
    {
        private readonly IUsuarioRepository usuarioRepo;

        public TestUsuario(IUsuarioRepository usuarioRepo)
        {
            this.usuarioRepo = usuarioRepo;
        }

        [TestMethod]
        public async Task TestMethod1Async()
        {
            Usuario user = await usuarioRepo.Login("leburgosdiaz@gmail.com","1234");
            Assert.AreEqual(false,user);
        }
    }
}
