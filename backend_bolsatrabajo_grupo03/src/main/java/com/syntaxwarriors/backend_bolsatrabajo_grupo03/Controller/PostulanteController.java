package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.PostulanteDto;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.UpdatePostulanteDto;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.PostulanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/postulantes")
@CrossOrigin(origins = "*")
public class PostulanteController {

    @Autowired
    private PostulanteService postulanteService;

    /**
     * Obtener perfil del postulante autenticado
     */
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String correo = authentication.getName();

            PostulanteDto postulante = postulanteService.obtenerPerfilPorCorreo(correo);
            return ResponseEntity.ok(postulante);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al obtener el perfil: " + e.getMessage()));
        }
    }

    /**
     * Obtener curriculum en formato JSON
     */
    @GetMapping("curriculum/{id}")
    public ResponseEntity<Object> getCurriculum(@PathVariable Integer id) {
        try {
            String curriculumJson = postulanteService.obtenerCurriculumJson(id);
            ObjectMapper mapper = new ObjectMapper();
            Object jsonObject = mapper.readValue(curriculumJson, Object.class);
            return ResponseEntity.ok(jsonObject);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al procesar el currículum");
        }
    }

    /**
     * Actualizar perfil del postulante
     */
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@Valid @RequestBody UpdatePostulanteDto updateDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String correo = authentication.getName();

            PostulanteDto postulanteActualizado = postulanteService.actualizarPerfil(correo, updateDto);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Perfil actualizado exitosamente",
                    "postulante", postulanteActualizado
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al actualizar el perfil: " + e.getMessage()));
        }
    }

    /**
     * Obtener perfil por ID (para administradores)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPostulantePorId(@PathVariable Integer id) {
        try {
            PostulanteDto postulante = postulanteService.obtenerPostulantePorId(id);
            return ResponseEntity.ok(postulante);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al obtener el postulante: " + e.getMessage()));
        }
    }

    /**
     * Verificar si el perfil está completo
     */
    @GetMapping("/perfil/completado")
    public ResponseEntity<?> verificarPerfilCompleto() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String correo = authentication.getName();

            boolean perfilCompleto = postulanteService.verificarPerfilCompleto(correo);
            return ResponseEntity.ok(Map.of(
                    "perfilCompleto", perfilCompleto,
                    "mensaje", perfilCompleto ? "Perfil completado" : "Perfil incompleto"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al verificar el perfil: " + e.getMessage()));
        }
    }

    /**
     * Marcar perfil como completado
     */
    @PatchMapping("/perfil/completar")
    public ResponseEntity<?> completarPerfil() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String correo = authentication.getName();

            postulanteService.marcarPerfilComoCompletado(correo);
            return ResponseEntity.ok(Map.of("mensaje", "Perfil marcado como completado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al completar el perfil: " + e.getMessage()));
        }
    }

    /**
     * Subir foto de perfil
     */
    @PostMapping("/perfil/foto")
    public ResponseEntity<?> subirFotoPerfil(@RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String correo = authentication.getName();
            String fotoBase64 = request.get("foto");

            if (fotoBase64 == null || fotoBase64.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "La foto es requerida"));
            }

            postulanteService.actualizarFotoPerfil(correo, fotoBase64);
            return ResponseEntity.ok(Map.of("mensaje", "Foto de perfil actualizada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al subir la foto: " + e.getMessage()));
        }
    }
}