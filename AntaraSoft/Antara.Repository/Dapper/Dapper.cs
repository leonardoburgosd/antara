using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Repository.Dapper
{
    public class Dapper : IDapper
    {
        private IDbConnection connection;
        public async Task<dynamic> Consultas<T>(string cadenaConexion, string procedimientoAlmacenado, dynamic parametros = null) where T : class
        {
            try
            {
                using (connection = new SqlConnection(cadenaConexion))
                {
                    return await connection.QueryAsync<T>(procedimientoAlmacenado, param: (object)parametros, commandType: CommandType.StoredProcedure);
                }
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task<T> Insert<T>(string cadenaConexion, string procedimientoAlmacenado, dynamic parametros = null) where T : class
        {
            try
            {
                using (connection = new SqlConnection(cadenaConexion))
                {
                    var result = await connection.QueryAsync<T>(procedimientoAlmacenado, param: (object)parametros, commandType: CommandType.StoredProcedure);
                    return await Task.Run(() => Enumerable.FirstOrDefault<T>(result));
                }
            }
            catch (Exception err)
            {
                throw err;
            }
        }

        public async Task<T> QueryWithReturn<T>(string conexionString, string storedProcedure, dynamic parameters = null) where T : class
        {
            try
            {
                using (IDbConnection connection = new SqlConnection(conexionString))
                {
                    var result = await connection.QueryAsync<T>(storedProcedure, param: (object)parameters, commandType: CommandType.StoredProcedure);
                    return  await Task.Run(() => Enumerable.FirstOrDefault<T>(result)); ;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
