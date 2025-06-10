package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Empresa;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    Optional<Empresa> findByUsuario(Usuario usuario);
    Optional<Empresa> findByUsuarioCorreo(String correo);
    Optional<Empresa> findByNitEmpresa(String nitEmpresa);
    boolean existsByNitEmpresa(String nitEmpresa);
}
