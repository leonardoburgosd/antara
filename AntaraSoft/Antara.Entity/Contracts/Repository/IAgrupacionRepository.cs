﻿using Antara.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Antara.Model.Contracts.Repository
{
    public interface IAgrupacionRepository
    {
        Task<Agrupacion> CreateAgrupacion(Agrupacion agrupacion);
        Task<Agrupacion> GetAgrupacion(long id);
        Task<List<Agrupacion>> GetAllAgrupacion(long userId);
        Task UpdateAgrupacion(Agrupacion agrupacion);
        Task DeleteAgrupacion(long id);
        Task<Boolean> AddAudioToAgrupacion(Agrupacion_Audio agrupacion_audio);
    }
}
