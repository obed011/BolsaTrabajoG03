package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionEmpresaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.EmpresaAplicacionOfertaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresas/{empresaId}/aplicaciones")
@CrossOrigin(origins = "*")
public class EmpresaAplicacionOfertaController {
    @Autowired
    private EmpresaAplicacionOfertaService aplicacionOfertaService;

    /**
     * Obtener todas las aplicaciones de una empresa con filtros opcionales
     */
    @GetMapping
    public ResponseEntity<Page<AplicacionEmpresaDTO>> obtenerAplicacionesPorEmpresa(
            @PathVariable Integer empresaId,
            @RequestParam(required = false) Integer ofertaId,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AplicacionEmpresaDTO> aplicaciones;

            if (ofertaId != null || estado != null) {
                // Usar filtros
                aplicaciones = aplicacionOfertaService.obtenerPostulantesConFiltros(empresaId, ofertaId, estado, pageable);
            } else {
                // Sin filtros, obtener todas las aplicaciones de la empresa
                aplicaciones = aplicacionOfertaService.obtenerPostulantesPorEmpresa(
                        empresaId, pageable
                );
            }

            return ResponseEntity.ok(aplicaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener aplicaciones específicas de una oferta
     */
    @GetMapping("/oferta/{ofertaId}")
    public ResponseEntity<Page<AplicacionEmpresaDTO>> obtenerAplicacionesPorOferta(
            @PathVariable Integer empresaId,
            @PathVariable Integer ofertaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<AplicacionEmpresaDTO> aplicaciones = aplicacionOfertaService
                    .obtenerPostulantesPorEmpresaYOferta(empresaId, ofertaId, pageable);

            return ResponseEntity.ok(aplicaciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Actualizar el estado de una aplicación específica
     */
    @PutMapping("/oferta/{ofertaId}/postulante/{postulanteId}/estado")
    public ResponseEntity<Map<String, String>> actualizarEstadoAplicacion(
            @PathVariable Integer empresaId,
            @PathVariable Integer ofertaId,
            @PathVariable Integer postulanteId,
            @RequestBody Map<String, String> estadoRequest) {
        try {
            String nuevoEstado = estadoRequest.get("estado");

            if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            aplicacionOfertaService.actualizarEstadoAplicacion(ofertaId, postulanteId, nuevoEstado);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Estado actualizado correctamente",
                    "nuevoEstado", nuevoEstado
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtener los estados válidos para las aplicaciones
     */
    @GetMapping("/estados")
    public ResponseEntity<Map<String, List<String>>> obtenerEstadosValidos(
            @PathVariable Integer empresaId) {
        try {
            List<String> estados = aplicacionOfertaService.obtenerEstadosValidos();
            return ResponseEntity.ok(Map.of("estados", estados));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
