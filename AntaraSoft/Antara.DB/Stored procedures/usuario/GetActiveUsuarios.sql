CREATE PROCEDURE [dbo].[GetActiveUsuarios]
AS
	SELECT * FROM usuarios
	WHERE active = 1;