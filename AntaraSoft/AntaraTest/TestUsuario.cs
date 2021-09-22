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
            Usuario user = new Usuario() {
                Name=""
            };
            await usuarioRepo.CreateUsuario(user);
            Assert.AreEqual(true,);
        }
    }
}
