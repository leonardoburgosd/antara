CREATE PROCEDURE [dbo].[GetUsuario]
@id BIGINT
AS
	SELECT TOP 1 * FROM usuarios WHERE id = @id;