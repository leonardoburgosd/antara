CREATE TABLE [dbo].[tipos_agrupaciones]
(
	id BIGINT NOT NULL IDENTITY(1,1),
  name VARCHAR(45) NOT NULL,
  publicable BIT NOT NULL,
  editable BIT NOT NULL,
  PRIMARY KEY (id)
)
