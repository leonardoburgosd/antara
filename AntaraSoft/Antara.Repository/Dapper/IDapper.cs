using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Repository.Dapper
{
    public interface IDapper
    {
        Task<dynamic> Consultas<T>(string cadenaConexion, string procedimientoAlmacenado, dynamic parametros = null) where T : class;

        Task<T> Insert<T>(string cadenaConexion, string procedimientoAlmacenado, dynamic parametros = null) where T : class;
        Task<T> QueryWithReturn<T>(string conexionString, string storedProcedure, dynamic parameters = null) where T : class;
    }
}
