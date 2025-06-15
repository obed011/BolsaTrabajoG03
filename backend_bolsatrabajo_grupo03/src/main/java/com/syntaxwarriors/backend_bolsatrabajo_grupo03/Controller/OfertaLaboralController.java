package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.OfertaLaboralDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.OfertaLaboralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas/{empresaId}/ofertas")
@CrossOrigin(origins = "*")
public class OfertaLaboralController {

    @Autowired
    private OfertaLaboralService ofertaLaboralService;

    @GetMapping
    public ResponseEntity<List<OfertaLaboralDTO>> obtenerOfertasPorEmpresa(@PathVariable Integer empresaId) {
        try {
            List<OfertaLaboralDTO> ofertas = ofertaLaboralService.obtenerOfertasPorEmpresa(empresaId);
            return ResponseEntity.ok(ofertas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{ofertaId}")
    public ResponseEntity<OfertaLaboralDTO> obtenerOfertaPorId(
            @PathVariable Integer empresaId,
            @PathVariable Integer ofertaId) {
        try {
            OfertaLaboralDTO oferta = ofertaLaboralService.obtenerOfertaPorId(empresaId, ofertaId);
            return ResponseEntity.ok(oferta);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<OfertaLaboralDTO> crearOferta(
            @PathVariable Integer empresaId,
            @RequestBody OfertaLaboralDTO ofertaDTO) {
        try {
            ofertaDTO.setIdEmpresa(empresaId);
            OfertaLaboralDTO nuevaOferta = ofertaLaboralService.crearOferta(ofertaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOferta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{ofertaId}")
    public ResponseEntity<OfertaLaboralDTO> actualizarOferta(
            @PathVariable Integer empresaId,
            @PathVariable Integer ofertaId,
            @RequestBody OfertaLaboralDTO ofertaDTO) {
        try {
            OfertaLaboralDTO ofertaActualizada = ofertaLaboralService.actualizarOferta(empresaId, ofertaId, ofertaDTO);
            return ResponseEntity.ok(ofertaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{ofertaId}")
    public ResponseEntity<Void> eliminarOferta(
            @PathVariable Integer empresaId,
            @PathVariable Integer ofertaId) {
        try {
            ofertaLaboralService.eliminarOferta(empresaId, ofertaId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}