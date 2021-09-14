CREATE TABLE [dbo].[tipos_agrupaciones]
(
  id VARCHAR(50) PRIMARY KEY  DEFAULT NEWID(),
  name VARCHAR(45) NOT NULL,
  publicable BIT NOT NULL,
  editable BIT NOT NULL
)
