package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PostulanteRepository extends JpaRepository<Postulante, Integer> {
    Optional<Postulante> findByUsuario(Usuario usuario);
    Optional<Postulante> findByUsuarioCorreo(String correo);
}
