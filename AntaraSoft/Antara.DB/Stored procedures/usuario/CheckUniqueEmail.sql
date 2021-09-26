CREATE PROCEDURE [dbo].[CheckUniqueEmail]
	@email VARCHAR(45)
AS
	SELECT * FROM usuarios
	WHERE email = @email;
GO
