package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.CategoriaOferta;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.CategoriaOfertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias-ofertas")
@CrossOrigin(origins = "*")
public class CategoriaOfertaController {

    @Autowired
    private CategoriaOfertaRepository categoriaOfertaRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaOferta>> getAllCategoriasOfertas() {
        try {
            List<CategoriaOferta> categorias = categoriaOfertaRepository.findAll();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
