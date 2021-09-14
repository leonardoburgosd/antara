CREATE PROCEDURE [dbo].[antara_usuario_create]
@email VARCHAR(45),
@password VARCHAR(150),
@name VARCHAR(45),
@gender BIT,
@birthDate DATE
AS
INSERT usuarios
			(
				email,
				password,
				name,
				gender,
				birthDate)
		values(
				@email,
				@password,
				@name,
				@gender,
				@birthDate
				)
select IDENT_CURRENT('usuarios')