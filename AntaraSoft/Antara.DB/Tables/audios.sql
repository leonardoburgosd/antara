CREATE TABLE [dbo].[audios]
(
	id VARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
  name VARCHAR(45) NOT NULL,
  registrationDate DATE NOT NULL,
  creationYear INT NULL DEFAULT 0,
  interpreter VARCHAR(45) NOT NULL,
  writer VARCHAR(45) NOT NULL,
  producer VARCHAR(45) NULL,
  reproductions INT NULL DEFAULT 0,
  Genero_id VARCHAR(50) FOREIGN KEY REFERENCES generos(id)
)
