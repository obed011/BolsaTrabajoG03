package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.HabilidadTecnicaDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.HabilidadTecnica;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.HabilidadTecnicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HabilidadTecnicaService {

    @Autowired
    private HabilidadTecnicaRepository habilidadTecnicaRepository;

    public List<HabilidadTecnicaDTO> getHabilidadesByCategoria(Integer categoriaId) {
        List<HabilidadTecnica> habilidades = habilidadTecnicaRepository.findByCategoriaHabilidadId(categoriaId);
        return habilidades.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HabilidadTecnicaDTO> getAllHabilidades() {
        List<HabilidadTecnica> habilidades = habilidadTecnicaRepository.findAll();
        return habilidades.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private HabilidadTecnicaDTO convertToDTO(HabilidadTecnica habilidad) {
        return new HabilidadTecnicaDTO(
                habilidad.getIdHabilidad(),
                habilidad.getCategoriaHabilidad().getIdCategoriaHab(),
                habilidad.getCategoriaHabilidad().getNomCategoriaHab(),
                habilidad.getNomHabilidad()
        );
    }
}
