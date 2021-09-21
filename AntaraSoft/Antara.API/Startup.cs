using Antara.Model;
using Antara.Model.Contracts;
using Antara.Repository.Dapper;
using Antara.Repository.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Antara.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddOptions();
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.AddTransient<IDapper, Antara.Repository.Dapper.Dapper>();
            services.AddTransient<IUsuario, UsuarioRepository>();
            services.AddAuthentication()
                .AddGoogle(options =>
                {
                    IConfigurationSection googleAuthSection = Configuration.GetSection("Authentication:Google");
                    options.ClientId = googleAuthSection["ClienteId"];
                    options.ClientSecret = googleAuthSection["ClienteSecret"];
                });
                
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseDeveloperExceptionPage();
            app.UseCors("AllowWebapp");


            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
