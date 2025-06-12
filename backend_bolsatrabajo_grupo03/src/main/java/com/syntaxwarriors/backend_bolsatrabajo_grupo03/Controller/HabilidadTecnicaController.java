package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.HabilidadTecnicaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.HabilidadTecnicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/habilidades-tecnicas")
@CrossOrigin(origins = "*")
public class HabilidadTecnicaController {

    @Autowired
    private HabilidadTecnicaService habilidadTecnicaService;

    @GetMapping
    public ResponseEntity<List<HabilidadTecnicaDTO>> getAllHabilidades() {
        try {
            List<HabilidadTecnicaDTO> habilidades = habilidadTecnicaService.getAllHabilidades();
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<HabilidadTecnicaDTO>> getHabilidadesByCategoria(@PathVariable Integer categoriaId) {
        try {
            List<HabilidadTecnicaDTO> habilidades = habilidadTecnicaService.getHabilidadesByCategoria(categoriaId);
            return ResponseEntity.ok(habilidades);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}