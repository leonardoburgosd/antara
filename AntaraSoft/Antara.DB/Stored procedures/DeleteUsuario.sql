CREATE PROCEDURE [dbo].[DeleteUsuario]
	@id BIGINT,
	@active BIT
AS
	UPDATE usuarios 
	SET active = @active
	WHERE id = @id
GO
