package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.AplicacionOfertaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.OfertaLaboralDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.AplicacionOfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postulantes")
@CrossOrigin(origins = "*")
public class PostulanteOfertaController {

    @Autowired
    private AplicacionOfertaService aplicacionOfertaService;

    // Obtener todas las ofertas activas (página de inicio)
    @GetMapping("/ofertas")
    public ResponseEntity<List<OfertaLaboralDTO>> obtenerOfertasActivas() {
        try {
            List<OfertaLaboralDTO> ofertas = aplicacionOfertaService.obtenerOfertasActivas();
            return ResponseEntity.ok(ofertas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Filtrar ofertas por categoría
    @GetMapping("/ofertas/categoria/{categoriaId}")
    public ResponseEntity<List<OfertaLaboralDTO>> obtenerOfertasPorCategoria(@PathVariable Integer categoriaId) {
        try {
            List<OfertaLaboralDTO> ofertas = aplicacionOfertaService.obtenerOfertasPorCategoria(categoriaId);
            return ResponseEntity.ok(ofertas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener detalle de una oferta específica
    @GetMapping("/ofertas/{ofertaId}")
    public ResponseEntity<OfertaLaboralDTO> obtenerDetalleOferta(@PathVariable Integer ofertaId) {
        try {
            OfertaLaboralDTO oferta = aplicacionOfertaService.obtenerDetalleOferta(ofertaId);
            return ResponseEntity.ok(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Aplicar a una oferta
    @PreAuthorize("hasRole('POSTULANTE')")
    @PostMapping("/{postulanteId}/aplicar/{ofertaId}")
    public ResponseEntity<AplicacionOfertaDTO> aplicarAOferta(
            @PathVariable Integer postulanteId,
            @PathVariable Integer ofertaId) {
        try {
            AplicacionOfertaDTO aplicacion = aplicacionOfertaService.aplicarAOferta(ofertaId, postulanteId);
            return ResponseEntity.status(HttpStatus.CREATED).body(aplicacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Verificar si ya aplicó a una oferta
    @GetMapping("/{postulanteId}/ofertas/{ofertaId}/aplicado")
    public ResponseEntity<Map<String, Boolean>> verificarAplicacion(
            @PathVariable Integer postulanteId,
            @PathVariable Integer ofertaId) {
        try {
            boolean haAplicado = aplicacionOfertaService.haAplicado(ofertaId, postulanteId);
            return ResponseEntity.ok(Map.of("haAplicado", haAplicado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Obtener mis aplicaciones
    @GetMapping("/{postulanteId}/aplicaciones")
    public ResponseEntity<List<AplicacionOfertaDTO>> obtenerMisAplicaciones(@PathVariable Integer postulanteId) {
        try {
            List<AplicacionOfertaDTO> aplicaciones = aplicacionOfertaService.obtenerAplicacionesPostulante(postulanteId);
            return ResponseEntity.ok(aplicaciones);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}