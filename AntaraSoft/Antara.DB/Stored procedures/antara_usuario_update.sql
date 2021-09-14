CREATE PROCEDURE [dbo].[antara_usuario_update]
@id VARCHAR(50),
@email VARCHAR(45),
@password VARCHAR(150),
@name VARCHAR(45),
@gender BIT,
@birthDate DATE,
@active BIT,
@country VARCHAR(45)
AS
UPDATE usuarios
SET email=@email,
	password=@password,
	name=@name,
	birthDate=@birthDate,
	gender=@gender,
	country=@country,
	updateDate=GETDATE()
WHERE id = @id
