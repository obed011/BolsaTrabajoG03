package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.CreateHabilidadRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.HabilidadesDTO;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.HabilidadTecnica;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Habilidades;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.HabilidadTecnicaRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.HabilidadesRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.PostulanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HabilidadesService {

    @Autowired
    private HabilidadesRepository habilidadesRepository;

    @Autowired
    private PostulanteRepository postulanteRepository;

    @Autowired
    private HabilidadTecnicaRepository habilidadTecnicaRepository;

    public List<HabilidadesDTO> getHabilidadesByPostulante(Integer postulanteId) {
        List<Habilidades> habilidades = habilidadesRepository.findByPostulanteId(postulanteId);
        return habilidades.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HabilidadesDTO createHabilidad(CreateHabilidadRequest request) {
        // Validar que existan el postulante y la habilidad técnica
        Optional<Postulante> postulanteOpt = postulanteRepository.findById(request.getIdPostulante());
        Optional<HabilidadTecnica> habilidadTecnicaOpt = habilidadTecnicaRepository.findById(request.getIdHabilidadTecnica());

        if (postulanteOpt.isEmpty()) {
            throw new RuntimeException("Postulante no encontrado");
        }

        if (habilidadTecnicaOpt.isEmpty()) {
            throw new RuntimeException("Habilidad Técnica no encontrada");
        }

        // NUEVA VALIDACIÓN: Verificar que no se repita la habilidad
        boolean habilidadExiste = habilidadesRepository.existsByPostulanteAndHabilidadTecnica(
                request.getIdPostulante(),
                request.getIdHabilidadTecnica()
        );

        if (habilidadExiste) {
            String nombreHabilidad = habilidadTecnicaOpt.get().getNomHabilidad();
            throw new RuntimeException("El postulante ya tiene registrada la habilidad: " + nombreHabilidad);
        }

        Habilidades habilidad = new Habilidades();
        habilidad.setPostulante(postulanteOpt.get());
        habilidad.setHabilidadTecnica(habilidadTecnicaOpt.get());
        habilidad.setNivel(request.getNivel());

        Habilidades savedHabilidad = habilidadesRepository.save(habilidad);
        return convertToDTO(savedHabilidad);
    }

    public HabilidadesDTO updateHabilidad(Integer id, CreateHabilidadRequest request) {
        Optional<Habilidades> habilidadOpt = habilidadesRepository.findById(id);
        if (habilidadOpt.isEmpty()) {
            throw new RuntimeException("Habilidad no encontrada");
        }

        Habilidades habilidad = habilidadOpt.get();

        // Si se va a cambiar la habilidad técnica, validar que no se repita
        if (request.getIdHabilidadTecnica() != null &&
                !request.getIdHabilidadTecnica().equals(habilidad.getHabilidadTecnica().getIdHabilidad())) {

            Optional<HabilidadTecnica> habilidadTecnicaOpt = habilidadTecnicaRepository.findById(request.getIdHabilidadTecnica());
            if (habilidadTecnicaOpt.isEmpty()) {
                throw new RuntimeException("Habilidad Técnica no encontrada");
            }

            // NUEVA VALIDACIÓN: Verificar que no se repita (excluyendo el registro actual)
            boolean habilidadExiste = habilidadesRepository.existsByPostulanteAndHabilidadTecnicaExcludingCurrent(
                    habilidad.getPostulante().getIdPostulante(),
                    request.getIdHabilidadTecnica(),
                    id
            );

            if (habilidadExiste) {
                String nombreHabilidad = habilidadTecnicaOpt.get().getNomHabilidad();
                throw new RuntimeException("El postulante ya tiene registrada la habilidad: " + nombreHabilidad);
            }

            habilidad.setHabilidadTecnica(habilidadTecnicaOpt.get());
        }

        // Actualizar el nivel
        if (request.getNivel() != null) {
            habilidad.setNivel(request.getNivel());
        }

        Habilidades updatedHabilidad = habilidadesRepository.save(habilidad);
        return convertToDTO(updatedHabilidad);
    }

    public void deleteHabilidad(Integer id) {
        if (!habilidadesRepository.existsById(id)) {
            throw new RuntimeException("Habilidad no encontrada");
        }
        habilidadesRepository.deleteById(id);
    }

    private HabilidadesDTO convertToDTO(Habilidades habilidad) {
        return new HabilidadesDTO(
                habilidad.getId(),
                habilidad.getPostulante().getIdPostulante(),
                habilidad.getHabilidadTecnica().getIdHabilidad(),
                habilidad.getHabilidadTecnica().getNomHabilidad(),
                habilidad.getHabilidadTecnica().getCategoriaHabilidad().getIdCategoriaHab(),
                habilidad.getHabilidadTecnica().getCategoriaHabilidad().getNomCategoriaHab(),
                habilidad.getNivel()
        );
    }
}