CREATE PROCEDURE [dbo].[CreateUsuario]
@email VARCHAR(45),
	@password VARCHAR(150),
	@name VARCHAR(45),
	@birthDate DATE,
	@gender CHAR,
	@active BIT,
	@registrationDate SMALLDATETIME,
	@country VARCHAR(45)
AS
	INSERT INTO usuarios(email,password,name,birthDate,gender,registrationDate,country,active)
	VALUES(@email,@password,@name,@birthDate,@gender,@registrationDate,@country,@active)