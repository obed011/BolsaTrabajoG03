package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogoAcademicoService {

    @Autowired
    private NivelAcademicoRepository nivelAcademicoRepository;

    @Autowired
    private EspecialidadAcademicaRepository especialidadAcademicaRepository;

    public List<NivelAcademicoDTO> obtenerNivelesAcademicos() {
        return nivelAcademicoRepository.findAll().stream()
                .map(nivel -> new NivelAcademicoDTO(
                        nivel.getIdNivAcademico(),
                        nivel.getNomNivel()))
                .collect(Collectors.toList());
    }

    public List<EspecialidadAcademicaDTO> obtenerEspecialidadesPorNivel(Integer idNivelAcademico) {
        return especialidadAcademicaRepository.findByNivelAcademicoId(idNivelAcademico).stream()
                .map(especialidad -> new EspecialidadAcademicaDTO(
                        especialidad.getIdEspecialidad(),
                        especialidad.getNomEsp(),
                        especialidad.getNivelAcademico().getIdNivAcademico()))
                .collect(Collectors.toList());
    }

    public List<EspecialidadAcademicaDTO> obtenerTodasEspecialidades() {
        return especialidadAcademicaRepository.findAll().stream()
                .map(especialidad -> new EspecialidadAcademicaDTO(
                        especialidad.getIdEspecialidad(),
                        especialidad.getNomEsp(),
                        especialidad.getNivelAcademico().getIdNivAcademico()))
                .collect(Collectors.toList());
    }
}