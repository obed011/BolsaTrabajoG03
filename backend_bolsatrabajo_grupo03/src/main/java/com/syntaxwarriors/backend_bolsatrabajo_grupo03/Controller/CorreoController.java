package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.CorreoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.CorreoRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/correos")
public class CorreoController {

    @Autowired
    private CorreoService correoService;

    @PostMapping("/enviar")
    public ResponseEntity<Map<String, String>> enviarCorreo(@RequestBody CorreoRequest request) {
        correoService.enviarCorreo(request.getDestino(), request.getAsunto(), request.getMensaje());
        return ResponseEntity.ok(Map.of(
                "mensaje", "Correo enviado correctamente"
        ));
    }
}
