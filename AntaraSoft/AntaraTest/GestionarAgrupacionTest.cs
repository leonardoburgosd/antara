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
        private readonly GestionarAlbumService _agrupacionService;
        public GestionarAgrupacionTest()
        {
            var options = Options.Create(new AppSettings());
            options.Value.ConexionString = "Server=.;Database=antaradb;Trusted_Connection=True;MultipleActiveResultSets=True";
            var dapper = new Antara.Repository.Dapper.Dapper(options);
            var agrupacionRepo = new AlbumRepository(dapper);
            _agrupacionService = new GestionarGrupoService(agrupacionRepo);
        }

        [TestMethod]
        [DataRow("PlayList", 0)]
        [DataRow("MiPlayList", 1)]
        [DataRow("PlayList", 2)]
        public void CrearGrupoTest(string type, int caso)
        {
            Grupo esperado = new();
            esperado.Id = Guid.NewGuid();
            esperado.Nombre = "TestAgrupacion1";
            esperado.Descripcion = "Agrupacion de prueba";
            esperado.FechaPublicacion = DateTime.Parse("1900-01-01");
            esperado.EstaPublicado = false;
            esperado.Tipo = type;
            esperado.UsuarioId = Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E");

            switch (caso)
            {
                case 0:
                    _agrupacionService.CrearGrupo(esperado).Wait();
                    Grupo actual = _agrupacionService.ObtenerGrupo(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Nombre, actual.Nombre);
                        Assert.AreEqual(esperado.Descripcion, actual.Descripcion);
                        Assert.AreEqual(esperado.Tipo, actual.Tipo);
                        Assert.AreEqual(esperado.UsuarioId, actual.UsuarioId);
                        _agrupacionService.EliminarGrupo(actual.Id).Wait();
                    }
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentException>(() =>
                    {
                        _agrupacionService.CrearGrupo(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Nombre = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _agrupacionService.CrearGrupo(esperado).Wait();
                    });
                    break;
            }

        }

        [TestMethod]
        [DataRow("PlayList", 0)]
        [DataRow("MiPlayList", 1)]
        [DataRow("PlayList", 2)]
        public void EditarGrupoTest(string tipo, int caso)
        {
            Grupo esperado = new();
            esperado.Id = Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415");
            esperado.Nombre = "TestAgrupacion0";
            esperado.Descripcion = "Agrupacion de prueba";
            esperado.Tipo = tipo;
            esperado.UsuarioId = Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E");

            switch (caso)
            {
                case 0:
                    _agrupacionService.EditarGrupo(esperado).Wait();
                    Grupo actual = _agrupacionService.ObtenerGrupo(esperado.Id).Result;
                    if (actual != null)
                    {
                        Assert.IsNotNull(actual.Id);
                        Assert.AreEqual(esperado.Nombre, actual.Nombre);
                        Assert.AreEqual(esperado.Descripcion, actual.Descripcion);
                        Assert.AreEqual(esperado.Tipo, actual.Tipo);
                        Assert.AreEqual(esperado.UsuarioId, actual.UsuarioId);
                    }
                    break;
                case 1:
                    Assert.ThrowsException<ArgumentException>(() =>
                    {
                        _agrupacionService.EditarGrupo(esperado).Wait();
                    });
                    break;
                case 2:
                    esperado.Nombre = null;
                    Assert.ThrowsException<AggregateException>(() =>
                    {
                        _agrupacionService.EditarGrupo(esperado).Wait();
                    });
                    break;
            }
        }

        [TestMethod]
        public void EliminarGrupoTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _agrupacionService.EliminarGrupo(Guid.Empty).Wait();
            });
        }

        [TestMethod]
        public void ObtenerGrupoTest()
        {
            Assert.ThrowsException<ArgumentNullException>(() =>
            {
                _agrupacionService.ObtenerGrupo(Guid.Empty).Wait();
            });
        }

        [DataRow(0)]
        [DataRow(1)]
        [TestMethod]
        public void ObtenerTodosGruposDeUsuarioTest(int caso)
        {
            switch(caso)
            {
                case 0:
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        List<Grupo> agrupacionList = _agrupacionService.ObtenerTodosGruposDeUsuario(Guid.Empty).Result;
                    });
                    break;
                case 1:
                    List<Grupo> agrupacionList = _agrupacionService.ObtenerTodosGruposDeUsuario(Guid.Parse("FDF9F847-DC95-45C4-9ACB-45C0DBD04D9E")).Result;
                    Assert.IsNotNull(agrupacionList);
                    break;
            }
        }

        [TestMethod]
        [DataRow(0)]
        [DataRow(1)]
        public void AgregarPistaAGrupoTest(int caso)
        {
            PlaylistPista esperado = new();
            esperado.PistaId = Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79");
            esperado.PlaylistId = Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415");
            if (caso == 0)
            {
                esperado.PlaylistId = Guid.Empty;
                Assert.ThrowsException<ArgumentNullException>(() =>
                {
                    _agrupacionService.AgregarPistaAGrupo(esperado);
                });
            }
            else
            {
                bool respuesta = _agrupacionService.AgregarPistaAGrupo(esperado).Result;
                Assert.IsTrue(respuesta);
                _agrupacionService.QuitarPistaDeGrupo(esperado).Wait();
            }
           

        }

        [TestMethod]
        [DataRow(0)]
        [DataRow(1)]
        public void QuitarPistaDeGrupo(int caso)
        {
            PlaylistPista grupoPista = new();
            switch(caso)
            {
                case 0:
                    grupoPista.PlaylistId = Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415");
                    grupoPista.PistaId = Guid.Empty;
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _agrupacionService.QuitarPistaDeGrupo(grupoPista).Wait();
                    });
                    break;
                case 1:
                    grupoPista.PlaylistId = Guid.Empty; ;
                    grupoPista.PistaId = Guid.Parse("130127A1-B71F-414A-A0DE-BEAFF0B01C79");
                    Assert.ThrowsException<ArgumentNullException>(() =>
                    {
                        _agrupacionService.QuitarPistaDeGrupo(grupoPista).Wait();
                    });
                    break;
            }
        }

        [TestMethod]
        [DataRow(0)]
        [DataRow(1)]
        public void PublicarGrupoTest(int caso)
        {
            Grupo agrupacion = _agrupacionService.ObtenerGrupo(Guid.Parse("580A2584-A918-4DFC-BCF7-6DB99CA07415")).Result;

            switch (caso)
            {
                case 0:
                    if(agrupacion != null)
                    {
                        bool estaPublicado = _agrupacionService.PublicarGrupo(agrupacion).Result;
                        Assert.IsTrue(estaPublicado);
                    }
                    break;
                case 1:
                    if (agrupacion != null)
                    {
                        Assert.ThrowsException<AggregateException>(() =>
                        {
                            bool estaPublicado = _agrupacionService.PublicarGrupo(agrupacion).Result;
                        });
                    }
                    break;

            }
        }
    }
}
