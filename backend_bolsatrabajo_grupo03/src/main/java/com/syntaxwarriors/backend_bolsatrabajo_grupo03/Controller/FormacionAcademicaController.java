package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.FormacionAcademicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/formacion-academica")
@CrossOrigin(origins = "*")
public class FormacionAcademicaController {

    @Autowired
    private FormacionAcademicaService formacionAcademicaService;

    @GetMapping
    public ResponseEntity<List<FormacionAcademicaDTO>> obtenerTodas() {
        List<FormacionAcademicaDTO> formaciones = formacionAcademicaService.obtenerTodas();
        return ResponseEntity.ok(formaciones);
    }

    @GetMapping("/postulante/{idPostulante}")
    public ResponseEntity<List<FormacionAcademicaDTO>> obtenerPorPostulante(@PathVariable Integer idPostulante) {
        List<FormacionAcademicaDTO> formaciones = formacionAcademicaService.obtenerPorPostulante(idPostulante);
        return ResponseEntity.ok(formaciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormacionAcademicaDTO> obtenerPorId(@PathVariable Integer id) {
        return formacionAcademicaService.obtenerPorId(id)
                .map(formacion -> ResponseEntity.ok(formacion))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FormacionAcademicaDTO> crear(@Valid @RequestBody FormacionAcademicaCreateUpdateDTO dto) {
        try {
            FormacionAcademicaDTO nuevaFormacion = formacionAcademicaService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaFormacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormacionAcademicaDTO> actualizar(@PathVariable Integer id,
                                                            @Valid @RequestBody FormacionAcademicaCreateUpdateDTO dto) {
        try {
            FormacionAcademicaDTO formacionActualizada = formacionAcademicaService.actualizar(id, dto);
            return ResponseEntity.ok(formacionActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        try {
            formacionAcademicaService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}