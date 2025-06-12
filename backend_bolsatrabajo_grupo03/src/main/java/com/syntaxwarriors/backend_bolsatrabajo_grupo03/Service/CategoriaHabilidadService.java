package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.CategoriaHabilidadDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.CategoriaHabilidad;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.CategoriaHabilidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaHabilidadService {

    @Autowired
    private CategoriaHabilidadRepository categoriaHabilidadRepository;

    public List<CategoriaHabilidadDTO> getAllCategorias() {
        List<CategoriaHabilidad> categorias = categoriaHabilidadRepository.findAll();
        return categorias.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CategoriaHabilidadDTO convertToDTO(CategoriaHabilidad categoria) {
        return new CategoriaHabilidadDTO(
                categoria.getIdCategoriaHab(),
                categoria.getNomCategoriaHab()
        );
    }
}
