package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.PostulanteDto;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.UpdatePostulanteDto;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Usuario;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.PostulanteRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PostulanteService {

    @Autowired
    private PostulanteRepository postulanteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtener perfil del postulante por correo
     */
    public PostulanteDto obtenerPerfilPorCorreo(String correo) {
        Postulante postulante = postulanteRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        return convertirADto(postulante);
    }

    /**
     * Obtener postulante por ID
     */
    public PostulanteDto obtenerPostulantePorId(Integer id) {
        Postulante postulante = postulanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        return convertirADto(postulante);
    }

    /**
     * Actualizar perfil del postulante
     */
    public PostulanteDto actualizarPerfil(String correo, UpdatePostulanteDto updateDto) {
        Postulante postulante = postulanteRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        // Actualizar campos
        if (updateDto.getNombres() != null && !updateDto.getNombres().trim().isEmpty()) {
            postulante.setNombres(updateDto.getNombres().trim());
        }

        if (updateDto.getApellidos() != null && !updateDto.getApellidos().trim().isEmpty()) {
            postulante.setApellidos(updateDto.getApellidos().trim());
        }

        if (updateDto.getTelCelular() != null && !updateDto.getTelCelular().trim().isEmpty()) {
            postulante.setTelCelular(updateDto.getTelCelular().trim());
        }

        if (updateDto.getTelFijo() != null && !updateDto.getTelFijo().trim().isEmpty()) {
            postulante.setTelFijo(updateDto.getTelFijo().trim());
        }

        if (updateDto.getFechaNacimiento() != null) {
            postulante.setFechaNacimiento(updateDto.getFechaNacimiento());
        }

        if (updateDto.getDireccion() != null && !updateDto.getDireccion().trim().isEmpty()) {
            postulante.setDireccion(updateDto.getDireccion().trim());
        }

        if (updateDto.getGenero() != null && !updateDto.getGenero().trim().isEmpty()) {
            postulante.setGenero(updateDto.getGenero().trim());
        }

        if (updateDto.getEsNacional() != null) {
            postulante.setEsNacional(updateDto.getEsNacional());
        }

        if (updateDto.getDui() != null && !updateDto.getDui().trim().isEmpty()) {
            postulante.setDui(updateDto.getDui().trim());
        }

        if (updateDto.getPasaporte() != null && !updateDto.getPasaporte().trim().isEmpty()) {
            postulante.setPasaporte(updateDto.getPasaporte().trim());
        }

        if (updateDto.getNit() != null && !updateDto.getNit().trim().isEmpty()) {
            postulante.setNit(updateDto.getNit().trim());
        }

        if (updateDto.getNup() != null && !updateDto.getNup().trim().isEmpty()) {
            postulante.setNup(updateDto.getNup().trim());
        }

        if (updateDto.getLinkGithub() != null && !updateDto.getLinkGithub().trim().isEmpty()) {
            postulante.setLinkGithub(updateDto.getLinkGithub().trim());
        }

        if (updateDto.getLinkLinkedin() != null && !updateDto.getLinkLinkedin().trim().isEmpty()) {
            postulante.setLinkLinkedin(updateDto.getLinkLinkedin().trim());
        }

        // Verificar si el perfil debe marcarse como completado automáticamente
        if (esPerfilCompleto(postulante)) {
            postulante.setEstadoPerfil(true);
        }

        Postulante postulanteActualizado = postulanteRepository.save(postulante);
        return convertirADto(postulanteActualizado);
    }

    /**
     * Actualizar foto de perfil
     */
    public void actualizarFotoPerfil(String correo, String fotoBase64) {
        Postulante postulante = postulanteRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        postulante.setFotoPerfil(fotoBase64);
        postulanteRepository.save(postulante);
    }

    /**
     * Verificar si el perfil está completo
     */
    public boolean verificarPerfilCompleto(String correo) {
        Postulante postulante = postulanteRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        return esPerfilCompleto(postulante);
    }

    /**
     * Marcar perfil como completado manualmente
     */
    public void marcarPerfilComoCompletado(String correo) {
        Postulante postulante = postulanteRepository.findByUsuarioCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Postulante no encontrado"));

        if (!esPerfilCompleto(postulante)) {
            throw new RuntimeException("El perfil no está completo. Complete todos los campos obligatorios.");
        }

        postulante.setEstadoPerfil(true);
        postulanteRepository.save(postulante);
    }

    /**
     * Verificar internamente si el perfil está completo
     */
    private boolean esPerfilCompleto(Postulante postulante) {
        return postulante.getNombres() != null && !postulante.getNombres().trim().isEmpty() &&
                postulante.getApellidos() != null && !postulante.getApellidos().trim().isEmpty() &&
                postulante.getTelCelular() != null && !postulante.getTelCelular().trim().isEmpty() &&
                postulante.getFechaNacimiento() != null &&
                postulante.getDireccion() != null && !postulante.getDireccion().trim().isEmpty() &&
                postulante.getGenero() != null && !postulante.getGenero().trim().isEmpty() &&
                postulante.getEsNacional() != null &&
                // Verificar documento de identidad según nacionalidad
                (postulante.getEsNacional() ?
                        (postulante.getDui() != null && !postulante.getDui().trim().isEmpty()) :
                        (postulante.getPasaporte() != null && !postulante.getPasaporte().trim().isEmpty()));
    }

    /**
     * Convertir entidad a DTO
     */
    private PostulanteDto convertirADto(Postulante postulante) {
        PostulanteDto dto = new PostulanteDto();
        dto.setIdPostulante(postulante.getIdPostulante());
        dto.setCorreo(postulante.getUsuario().getCorreo());
        dto.setNombres(postulante.getNombres());
        dto.setApellidos(postulante.getApellidos());
        dto.setTelCelular(postulante.getTelCelular());
        dto.setTelFijo(postulante.getTelFijo());
        dto.setFechaNacimiento(postulante.getFechaNacimiento());
        dto.setDireccion(postulante.getDireccion());
        dto.setGenero(postulante.getGenero());
        dto.setEsNacional(postulante.getEsNacional());
        dto.setDui(postulante.getDui());
        dto.setPasaporte(postulante.getPasaporte());
        dto.setNit(postulante.getNit());
        dto.setNup(postulante.getNup());
        dto.setFotoPerfil(postulante.getFotoPerfil());
        dto.setLinkGithub(postulante.getLinkGithub());
        dto.setLinkLinkedin(postulante.getLinkLinkedin());
        dto.setEstadoPerfil(postulante.getEstadoPerfil());
        dto.setFechaCreacion(postulante.getFechaCreacion());
        dto.setFechaActualizacion(postulante.getFechaActualizacion());
        return dto;
    }
}