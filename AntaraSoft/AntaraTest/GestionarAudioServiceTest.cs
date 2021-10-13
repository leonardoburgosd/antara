using Antara.Model;
using Antara.Model.Entities;
using Antara.Repository.Repositories;
using Antara.Service;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AntaraTest
{
    [TestClass]
    public class GestionarAudioServiceTest
    {
        private readonly GestionarAudioService _audioService;
        public GestionarAudioServiceTest()
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var audioRepo = new AudioRepository(dapper);
            _audioService = new GestionarAudioService(audioRepo);
        }

        [TestMethod]
        [DataRow("urlUnico", 0)]
        [DataRow("urlYaUsado", 1)]
        [DataRow(null, 1)]
        [DataRow("urlUnico", 2)]
        public void CreateAudioTest(string url, int caso)
        {
            Audio esperado = new();
            esperado.Id = Guid.NewGuid();
            esperado.Name = "TestAudio0";
            esperado.RegistrationDate = DateTime.Now;
            esperado.CreationYear = 1992;
            esperado.Interpreter = "Guns N' Roses";
            esperado.Writer = "Axl Rose";
            esperado.Producer = "Diego";
            esperado.Reproductions = 0;
            esperado.Genero_id = 27;
            esperado.Url = url;
            esperado.User_id = Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E");

            switch (caso)
            {
                case 0:
                    _audioService.CreateAudio(esperado).Wait();
                    Audio actual = _audioService.GetAudio(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Name, actual.Name);
                        Assert.AreEqual(esperado.Url, actual.Url);
                        Assert.AreEqual(esperado.CreationYear, actual.CreationYear);
                        Assert.AreEqual(esperado.Interpreter, actual.Interpreter);
                        Assert.AreEqual(esperado.Writer, actual.Writer);
                        Assert.AreEqual(esperado.Producer, actual.Producer);
                        Assert.IsNotNull(actual.RegistrationDate);
                        Assert.AreEqual(esperado.Genero_id, actual.Genero_id);
                        Assert.AreEqual(esperado.User_id, actual.User_id);

                        _audioService.DeleteAudio(actual.Id).Wait();
                    }
                    break;
                case 1:
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                       _audioService.CreateAudio(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Name = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _audioService.CreateAudio(esperado).Wait();
                    });
                    break;
            }

        }

        [TestMethod]
        [DataRow("urlUnico", 0)]
        [DataRow("urlYaUsado", 0)]
        [DataRow("urlYaUsado", 1)]
        [DataRow(null, 1)]
        [DataRow("urlUnico", 2)]
        public void UpdateAudioTest(string url, int caso)
        {
            Audio esperado = new();
            esperado.Id = Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79");
            esperado.Name = "TestAudio0";
            esperado.CreationYear = 1992;
            esperado.Interpreter = "Guns N' Roses";
            esperado.Writer = "Axl Rose";
            esperado.Producer = "Diego";
            esperado.Genero_id = 27;
            esperado.Url = url;

            switch (caso)
            {
                case 0:
                    _audioService.UpdateAudio(esperado).Wait();
                    Audio actual = _audioService.GetAudio(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.AreEqual(esperado.Id,actual.Id);
                        Assert.AreEqual(esperado.Name, actual.Name);
                        Assert.AreEqual(esperado.Url, actual.Url);
                        Assert.AreEqual(esperado.CreationYear, actual.CreationYear);
                        Assert.AreEqual(esperado.Interpreter, actual.Interpreter);
                        Assert.AreEqual(esperado.Writer, actual.Writer);
                        Assert.AreEqual(esperado.Producer, actual.Producer);
                        Assert.IsNotNull(actual.RegistrationDate);
                        Assert.AreEqual(esperado.Genero_id, actual.Genero_id);
                    }
                    break;
                case 1:
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _audioService.UpdateAudio(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Name = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _audioService.UpdateAudio(esperado).Wait();
                    });
                    break;
            }
        }

        [TestMethod]
        public void DeleteAudioTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _audioService.DeleteAudio(Guid.Empty).Wait();
            });
            
        }
        [TestMethod]
        public void GetAudioTest()
        {
            int id = 0;
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _audioService.GetAudio(Guid.Empty).Wait();
            });

        }
        [DataRow(0)]
        [DataRow(1)]
        [TestMethod]
        public void GetAllAudioTest(int caso)
        {
            switch (caso)
            {
                case 0:
                    List<Audio> audiosList = _audioService.GetAllAudio(Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415")).Result;
                    Assert.IsNotNull(audiosList);
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _audioService.GetAllAudio(Guid.Empty).Wait();
                    });
                    break;
            }
        }

        [TestMethod]
        [DataRow("Test", 0)]
        [DataRow(null, 1)]
        public void SearchAudioTest(string cadena,int caso)
        {
            switch (caso)
            {
                case 0:
                    List<Audio> audiosList = _audioService.SearchAudios(cadena).Result;
                    Assert.IsNotNull(audiosList);
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _audioService.SearchAudios(cadena).Wait();
                    });
                    break;
            }
        }
    }

}
