using Antara.Model;
using Antara.Model.Entities;
using Antara.Repository.Repositories;
using Antara.Service;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;


namespace AntaraTest
{
    [TestClass]
    public class GestionarAgrupacionTest
    {
        private readonly GestionarAgrupacionService _agrupacionService;
        public GestionarAgrupacionTest()
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var agrupacionRepo = new AgrupacionRepository(dapper);
            _agrupacionService = new GestionarAgrupacionService(agrupacionRepo);
        }

        [TestMethod]
        [DataRow("PlayList", 0)]
        [DataRow("MiPlayList", 1)]
        [DataRow("PlayList", 2)]
        public void CreateAgrupacionTest(string type, int caso)
        {
            Agrupacion esperado = new();
            esperado.Id = Guid.NewGuid();
            esperado.Name = "TestAgrupacion1";
            esperado.Description = "Agrupacion de prueba";
            esperado.PublicationDate = DateTime.Parse("1900-01-01");
            esperado.IsPublished = false;
            esperado.Type = type;
            esperado.User_id = Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E");

            switch (caso)
            {
                case 0:
                    _agrupacionService.CreateAgrupacion(esperado).Wait();
                    Agrupacion actual = _agrupacionService.GetAgrupacion(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Name, actual.Name);
                        Assert.AreEqual(esperado.Description, actual.Description);
                        Assert.AreEqual(esperado.Type, actual.Type);
                        Assert.AreEqual(esperado.User_id, actual.User_id);
                        _agrupacionService.DeleteAgrupacion(actual.Id).Wait();
                    }
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentException>(() =>
                    {
                        _agrupacionService.CreateAgrupacion(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Name = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _agrupacionService.CreateAgrupacion(esperado).Wait();
                    });
                    break;
            }

        }

        [TestMethod]
        [DataRow("PlayList", 0)]
        [DataRow("MiPlayList", 1)]
        [DataRow("PlayList", 2)]
        public void UpdateAgrupacionTest(string type, int caso)
        {
            Agrupacion esperado = new();
            esperado.Id = Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415");
            esperado.Name = "TestAgrupacion0";
            esperado.Description = "Agrupacion de prueba";
            esperado.Type = type;
            esperado.User_id = Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E");

            switch (caso)
            {
                case 0:
                    _agrupacionService.UpdateAgrupacion(esperado).Wait();
                    Agrupacion actual = _agrupacionService.GetAgrupacion(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Name, actual.Name);
                        Assert.AreEqual(esperado.Description, actual.Description);
                        Assert.AreEqual(esperado.Type, actual.Type);
                        Assert.AreEqual(esperado.User_id, actual.User_id);
                    }
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentException>(() =>
                    {
                        _agrupacionService.UpdateAgrupacion(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Name = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _agrupacionService.UpdateAgrupacion(esperado).Wait();
                    });
                    break;
            }
        }

        [TestMethod]
        public void DeleteAgrupacionTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _agrupacionService.DeleteAgrupacion(Guid.Empty).Wait();
            });
        }

        [TestMethod]
        public void GetAgrupacionTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _agrupacionService.GetAgrupacion(Guid.Empty).Wait();
            });
        }

        [DataRow(0)]
        [DataRow(1)]
        [TestMethod]
        public void GetAllAgrupacionTest(int caso)
        {
            switch(caso)
            {
                case 0:
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        List<Agrupacion> agrupacionList = _agrupacionService.GetAllAgrupacion(Guid.Empty).Result;
                    });
                    break;
                case 1:
                    List<Agrupacion> agrupacionList = _agrupacionService.GetAllAgrupacion(Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E")).Result;
                    Assert.IsNotNull(agrupacionList);
                    break;
            }
        }

        [TestMethod]
        [DataRow(0)]
        [DataRow(1)]
        public void AddAudioToAgrupacionTest(int caso)
        {
            Agrupacion_Audio esperado = new();
            esperado.Audio_id = Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79");
            esperado.Agrupacion_id = Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415");
            if (caso == 0)
            {
                esperado.Agrupacion_id = Guid.Empty;
                Assert.ThrowsException<ArgumentNullException>(() =>
                {
                    _agrupacionService.AddAudioToAgrupacion(esperado);
                });
            }
            else
            {
                bool respuesta = _agrupacionService.AddAudioToAgrupacion(esperado).Result;
                Assert.IsTrue(respuesta);
                _agrupacionService.RemoveAudioFromAgrupacion(esperado.Agrupacion_id, esperado.Audio_id).Wait();
            }
           

        }

        [TestMethod]
        [DataRow(0)]
        [DataRow(1)]
        public void RemoveAudioFromAgrupacion(int caso)
        {
            Guid agrupacionId;
            Guid audioId;
            switch(caso)
            {
                case 0:
                    agrupacionId = Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415");
                    audioId = Guid.Empty;
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _agrupacionService.RemoveAudioFromAgrupacion(agrupacionId, audioId).Wait();
                    });
                    break;
                case 1:
                    agrupacionId = Guid.Empty; ;
                    audioId = Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79");
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _agrupacionService.RemoveAudioFromAgrupacion(agrupacionId, audioId).Wait();
                    });
                    break;
            }
            
        }
    }
}
