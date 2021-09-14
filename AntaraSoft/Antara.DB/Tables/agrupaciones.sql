CREATE TABLE [dbo].[agrupaciones]
(
	id VARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
    name VARCHAR(45) NOT NULL,
    description VARCHAR(150) NULL,
    published BIT NOT NULL DEFAULT 0,
    tipos_agrupaciones_id VARCHAR(50) FOREIGN KEY  REFERENCES tipos_agrupaciones(id),
    usuarios_id VARCHAR(50) FOREIGN KEY REFERENCES usuarios (id)
)