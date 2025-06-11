package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.ExperienciaLaboralDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.ExperienciaLaboralCreateDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.CategoriaPuestoDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.ExperienciaLaboralService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/experiencia-laboral")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*")
public class ExperienciaLaboralController {
    private final ExperienciaLaboralService experienciaLaboralService;

    @GetMapping("/postulante/{idPostulante}")
    public ResponseEntity<List<ExperienciaLaboralDTO>> obtenerExperienciasPorPostulante(
            @PathVariable Integer idPostulante) {
        List<ExperienciaLaboralDTO> experiencias = experienciaLaboralService
                .obtenerExperienciasPorPostulante(idPostulante);
        return ResponseEntity.ok(experiencias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienciaLaboralDTO> obtenerExperienciaPorId(@PathVariable Integer id) {
        return experienciaLaboralService.obtenerExperienciaPorId(id)
                .map(experiencia -> ResponseEntity.ok(experiencia))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ExperienciaLaboralDTO> crearExperiencia(
            @Valid @RequestBody ExperienciaLaboralCreateDTO createDTO) {
        try {
            ExperienciaLaboralDTO experienciaCreada = experienciaLaboralService.crearExperiencia(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(experienciaCreada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienciaLaboralDTO> actualizarExperiencia(
            @PathVariable Integer id,
            @Valid @RequestBody ExperienciaLaboralCreateDTO updateDTO) {
        try {
            ExperienciaLaboralDTO experienciaActualizada = experienciaLaboralService
                    .actualizarExperiencia(id, updateDTO);
            return ResponseEntity.ok(experienciaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarExperiencia(@PathVariable Integer id) {
        try {
            experienciaLaboralService.eliminarExperiencia(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaPuestoDTO>> obtenerCategorias() {
        List<CategoriaPuestoDTO> categorias = experienciaLaboralService.obtenerTodasLasCategorias();
        return ResponseEntity.ok(categorias);
    }
}
