CREATE TABLE [dbo].[agrupaciones_audios]
(
	agrupaciones_id BIGINT NOT NULL,
  audios_id BIGINT NOT NULL,
  PRIMARY KEY (agrupaciones_id, audios_id),
  CONSTRAINT fk_agrupaciones_has_Audios_agrupaciones1
    FOREIGN KEY (agrupaciones_id)
    REFERENCES agrupaciones (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_agrupaciones_has_Audios_Audios1
    FOREIGN KEY (audios_id)
    REFERENCES audios (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
