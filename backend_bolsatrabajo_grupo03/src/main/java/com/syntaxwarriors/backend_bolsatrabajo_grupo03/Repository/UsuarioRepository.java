package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    Optional<Usuario> findByCorreoAndEstado(String correo, Boolean estado);
}
