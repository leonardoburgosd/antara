using System;
using BCryptNet = BCrypt.Net.BCrypt;
namespace Antara.Security
{
    public interface IEncryptText
    {
        string GeneratePasswordHash(string texto);
        Boolean ComprarHash(string textoNoEncriptado, string textoEncriptado);
    }
    public class EncryptText: IEncryptText
    {
        public bool ComprarHash(string textoNoEncriptado, string textoEncriptado)
        {
            return BCryptNet.Verify(textoNoEncriptado, textoEncriptado);
        }

        public string GeneratePasswordHash(string texto)
        {
            return BCryptNet.HashPassword(texto);
        }
    }
}
