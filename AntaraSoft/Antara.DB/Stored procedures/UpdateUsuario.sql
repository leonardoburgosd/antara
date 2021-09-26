CREATE PROCEDURE [dbo].[UpdateUsuario]
	@id BIGINT,
	@name VARCHAR(45),
	@birthDate DATE,
	@gender CHAR,
	@country VARCHAR(45)
AS
	UPDATE usuarios 
	SET name = @name, birthDate = @birthDate, gender = @gender, country = @country
	WHERE id = @id
GO