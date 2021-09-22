CREATE PROCEDURE [dbo].[Antara_Usuario_Login]
@Email VARCHAR(45),
@Password VARCHAR(150)
AS
SELECT email, name, birthDate, gender, registrationDate, country
FROM usuarios
WHERE active = 1 AND email = @Email AND password = @Password