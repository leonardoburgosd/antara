CREATE TABLE [dbo].[agrupaciones_audios]
(
	agrupaciones_id VARCHAR(50) PRIMARY KEY DEFAULT NEWID(),
	audios_id VARCHAR(50) FOREIGN KEY REFERENCES audios(id)
)
