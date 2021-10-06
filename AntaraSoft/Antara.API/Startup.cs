using Antara.Model;
using Antara.Model.Contracts;
using Antara.Model.Contracts.Repository;
using Antara.Model.Contracts.Services;
using Antara.Repository.Dapper;
using Antara.Repository.Repositories;
using Antara.Security;
using Antara.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;


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
            services.AddTransient<IUsuarioRepository, UsuarioRepository>();
            services.AddTransient<IAudioRepository, AudioRepository>();
            services.AddTransient<IAgrupacionRepository, AgrupacionRepository>();
            services.AddTransient<IRegistrarUsuarioService, RegistrarUsuarioService>();
            services.AddTransient<ILoginService, LoginService>();
            services.AddTransient<IGestionarAudioService, GestionarAudioService>();
            services.AddTransient<IGestionarAgrupacionService, GestionarAgrupacionService>();
            services.AddTransient<IEncryptText, EncryptText>();
            /*
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());
            });
            */
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "AntaraApi", Version = "v1" });
            });
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
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AntaraApi v1"));
            }
            app.UseCors("AllowWebapp");


            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors("AllowSpecificOrigin");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
