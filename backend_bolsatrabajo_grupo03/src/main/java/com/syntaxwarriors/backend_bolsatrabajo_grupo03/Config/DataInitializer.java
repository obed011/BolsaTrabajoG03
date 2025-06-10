package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Config;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Rol;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Override
    public void run(String... args) throws Exception {
        // Crear roles por defecto si no existen
        if (!rolRepository.findByNombreRol("POSTULANTE").isPresent()) {
            Rol rolPostulante = new Rol();
            rolPostulante.setNombreRol("POSTULANTE");
            rolRepository.save(rolPostulante);
        }

        if (!rolRepository.findByNombreRol("ADMIN").isPresent()) {
            Rol rolAdmin = new Rol();
            rolAdmin.setNombreRol("ADMIN");
            rolRepository.save(rolAdmin);
        }

        if (!rolRepository.findByNombreRol("EMPRESA").isPresent()) {
            Rol rolEmpresa = new Rol();
            rolEmpresa.setNombreRol("EMPRESA");
            rolRepository.save(rolEmpresa);
        }
    }
}
