CREATE TABLE [dbo].[audios]
(
	  id BIGINT NOT NULL IDENTITY(0,1),
  name VARCHAR(45) NOT NULL,
  registrationDate DATE NOT NULL DEFAULT SYSDATETIME(),
  creationYear INT NULL DEFAULT 0,
  interpreter VARCHAR(45) NOT NULL,
  writer VARCHAR(45) NOT NULL,
  producer VARCHAR(45) NULL,
  reproductions INT NULL DEFAULT 0,
  Genero_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_Audios_Genero1
    FOREIGN KEY (Genero_id)
    REFERENCES generos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
