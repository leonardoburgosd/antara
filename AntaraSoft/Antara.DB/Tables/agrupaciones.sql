CREATE TABLE [dbo].[agrupaciones]
(
	id BIGINT NOT NULL IDENTITY(1,1),
  name VARCHAR(45) NOT NULL,
  description VARCHAR(150) NULL,
  published BIT NOT NULL DEFAULT 0,
  tipos_agrupaciones_id BIGINT NOT NULL,
  usuarios_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_agrupaciones_tipos_agrupacioness
    FOREIGN KEY (tipos_agrupaciones_id)
    REFERENCES tipos_agrupaciones (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_agrupaciones_usuarios1
    FOREIGN KEY (usuarios_id)
    REFERENCES usuarios (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
