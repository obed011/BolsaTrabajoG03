package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.CatalogoAcademicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "*")
public class CatalogoAcademicoController {

    @Autowired
    private CatalogoAcademicoService catalogoService;

    @GetMapping("/niveles-academicos")
    public ResponseEntity<List<NivelAcademicoDTO>> obtenerNivelesAcademicos() {
        List<NivelAcademicoDTO> niveles = catalogoService.obtenerNivelesAcademicos();
        return ResponseEntity.ok(niveles);
    }

    @GetMapping("/especialidades")
    public ResponseEntity<List<EspecialidadAcademicaDTO>> obtenerTodasEspecialidades() {
        List<EspecialidadAcademicaDTO> especialidades = catalogoService.obtenerTodasEspecialidades();
        return ResponseEntity.ok(especialidades);
    }

    @GetMapping("/especialidades/nivel/{idNivelAcademico}")
    public ResponseEntity<List<EspecialidadAcademicaDTO>> obtenerEspecialidadesPorNivel(@PathVariable Integer idNivelAcademico) {
        List<EspecialidadAcademicaDTO> especialidades = catalogoService.obtenerEspecialidadesPorNivel(idNivelAcademico);
        return ResponseEntity.ok(especialidades);
    }
}