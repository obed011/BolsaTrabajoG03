package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.CreateHabilidadRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.HabilidadesDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.HabilidadesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habilidades")
@CrossOrigin(origins = "*")
public class HabilidadesController {

    @Autowired
    private HabilidadesService habilidadesService;

    @GetMapping("/postulante/{postulanteId}")
    public ResponseEntity<List<HabilidadesDTO>> getHabilidadesByPostulante(@PathVariable Integer postulanteId) {
        try {
            List<HabilidadesDTO> habilidades = habilidadesService.getHabilidadesByPostulante(postulanteId);
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createHabilidad(@RequestBody CreateHabilidadRequest request) {
        try {
            HabilidadesDTO habilidad = habilidadesService.createHabilidad(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(habilidad);
        } catch (RuntimeException e) {
            // MEJORADO: Devolver mensaje de error específico
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHabilidad(@PathVariable Integer id, @RequestBody CreateHabilidadRequest request) {
        try {
            HabilidadesDTO habilidad = habilidadesService.updateHabilidad(id, request);
            return ResponseEntity.ok(habilidad);
        } catch (RuntimeException e) {
            // MEJORADO: Manejar diferentes tipos de error
            if (e.getMessage().contains("no encontrada")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHabilidad(@PathVariable Integer id) {
        try {
            habilidadesService.deleteHabilidad(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno del servidor"));
        }
    }
}
