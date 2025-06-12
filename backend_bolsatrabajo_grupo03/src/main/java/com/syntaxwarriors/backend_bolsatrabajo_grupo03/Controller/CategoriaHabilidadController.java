package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.CategoriaHabilidadDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.CategoriaHabilidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias-habilidades")
@CrossOrigin(origins = "*")
public class CategoriaHabilidadController {

    @Autowired
    private CategoriaHabilidadService categoriaHabilidadService;

    @GetMapping
    public ResponseEntity<List<CategoriaHabilidadDTO>> getAllCategorias() {
        try {
            List<CategoriaHabilidadDTO> categorias = categoriaHabilidadService.getAllCategorias();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
