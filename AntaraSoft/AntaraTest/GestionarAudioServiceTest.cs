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
        private readonly GestionarPistaService _audioService;
        public GestionarAudioServiceTest()
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var audioRepo = new PistaRepository(dapper);
            _audioService = new GestionarPistaService(audioRepo);
        }

        [TestMethod]
        [DataRow("urlUnico", 0)]
        [DataRow("urlYaUsado", 1)]
        [DataRow(null, 1)]
        [DataRow("urlUnico", 2)]
        public void CrearPistaTest(string url, int caso)
        {
            Pista esperado = new();
            esperado.Id = Guid.NewGuid();
            esperado.Nombre = "TestAudio0";
            esperado.FechaRegistro = DateTime.Now;
            esperado.AnoCreacion = 1992;
            esperado.Interprete = "Guns N' Roses";
            esperado.Compositor = "Axl Rose";
            esperado.Productor = "Diego";
            esperado.Reproducciones = 0;
            esperado.GeneroId = 27;
            esperado.Url = url;
            esperado.UsuarioId = Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E");

            switch (caso)
            {
                case 0:
                    _audioService.CrearPista(esperado).Wait();
                    Pista actual = _audioService.ObtenerPista(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Nombre, actual.Nombre);
                        Assert.AreEqual(esperado.Url, actual.Url);
                        Assert.AreEqual(esperado.AnoCreacion, actual.AnoCreacion);
                        Assert.AreEqual(esperado.Interprete, actual.Interprete);
                        Assert.AreEqual(esperado.Compositor, actual.Compositor);
                        Assert.AreEqual(esperado.Productor, actual.Productor);
                        Assert.IsNotNull(actual.FechaRegistro);
                        Assert.AreEqual(esperado.GeneroId, actual.GeneroId);
                        Assert.AreEqual(esperado.UsuarioId, actual.UsuarioId);

                        _audioService.EliminarPista(actual.Id).Wait();
                    }
                    break;
                case 1:
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                       _audioService.CrearPista(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Nombre = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _audioService.CrearPista(esperado).Wait();
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
        public void EditarPistaTest(string url, int caso)
        {
            Pista esperado = new();
            esperado.Id = Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79");
            esperado.Nombre = "TestAudio0";
            esperado.AnoCreacion = 1992;
            esperado.Interprete = "Guns N' Roses";
            esperado.Compositor = "Axl Rose";
            esperado.Productor = "Diego";
            esperado.GeneroId = 27;
            esperado.Url = url;

            switch (caso)
            {
                case 0:
                    _audioService.EditarPista(esperado).Wait();
                    Pista actual = _audioService.ObtenerPista(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.AreEqual(esperado.Id,actual.Id);
                        Assert.AreEqual(esperado.Nombre, actual.Nombre);
                        Assert.AreEqual(esperado.Url, actual.Url);
                        Assert.AreEqual(esperado.AnoCreacion, actual.AnoCreacion);
                        Assert.AreEqual(esperado.Interprete, actual.Interprete);
                        Assert.AreEqual(esperado.Compositor, actual.Compositor);
                        Assert.AreEqual(esperado.Productor, actual.Productor);
                        Assert.IsNotNull(actual.FechaRegistro);
                        Assert.AreEqual(esperado.GeneroId, actual.GeneroId);
                    }
                    break;
                case 1:
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _audioService.EditarPista(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Nombre = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _audioService.EditarPista(esperado).Wait();
                    });
                    break;
            }
        }

        [TestMethod]
        public void EliminarPistaTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _audioService.EliminarPista(Guid.Empty).Wait();
            });
            
        }
        [TestMethod]
        public void ObtenerPistaTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _audioService.ObtenerPista(Guid.Empty).Wait();
            });

        }
        [DataRow(0)]
        [DataRow(1)]
        [TestMethod]
        public void ObtenerTodosPistasDeGrupoTest(int caso)
        {
            switch (caso)
            {
                case 0:
                    List<Pista> audiosList = _audioService.ObtenerTodosPistasDeGrupo(Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415")).Result;
                    Assert.IsNotNull(audiosList);
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _audioService.ObtenerTodosPistasDeGrupo(Guid.Empty).Wait();
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
                    List<Pista> audiosList = _audioService.BuscarPistas(cadena).Result;
                    Assert.IsNotNull(audiosList);
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _audioService.BuscarPistas(cadena).Wait();
                    });
                    break;
            }
        }
        
        [TestMethod]
        public void ReproducirPista()
        {
            Pista audio = _audioService.ObtenerPista(Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79")).Result;
            int esperado = audio.Reproducciones + 1;
            _audioService.ReproducirPista(audio).Wait();
            int actual = (_audioService.ObtenerPista(Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79")).Result).Reproducciones;
            Assert.AreEqual(esperado, actual);
        }
    }

}
