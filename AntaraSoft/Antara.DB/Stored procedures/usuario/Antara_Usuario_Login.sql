CREATE PROCEDURE [dbo].[Antara_Usuario_Login]  
@Email VARCHAR(45)  
AS  
SELECT email, name, birthDate, gender, registrationDate, country, password  
FROM usuarios  
WHERE active = 1 AND email = @Email