package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response.DesbloqueoResponse;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Usuario;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.UsuarioRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Security.JwtUtil;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.CorreoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioDesbloqueoController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil; // ✅ ¡Faltaba esta anotación!

    @Autowired
    private CorreoService correoService;

    @PostMapping("/solicitar-desbloqueo")
    public ResponseEntity<?> solicitarDesbloqueo(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (Boolean.TRUE.equals(usuario.getEstado())) {
            return ResponseEntity.badRequest().body("La cuenta ya está activa.");
        }

        String token = jwtUtil.generarTokenDesbloqueo(correo);
        String link = "https://bolsatrabajo.vercel.app/desbloqueo-confirmado?token=" + token;
        String mensaje = "Haz clic en el siguiente enlace para desbloquear tu cuenta:\n\n" + link + "\n\nEste enlace expirará en 10 minutos.";

        correoService.enviarCorreo(correo, "Desbloqueo de cuenta", mensaje);

        return ResponseEntity.ok(new DesbloqueoResponse(true, "Correo de desbloqueo enviado"));
    }

    @PostMapping("/desbloquear-token")
    public ResponseEntity<?> desbloquearConToken(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        try {
            String correo = jwtUtil.obtenerCorreoDesdeToken(token);
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            usuario.setEstado(true);
            usuario.setFechaBloqueo(null);
            usuario.setIntentosLoginFallidos(0);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(new DesbloqueoResponse(true, "Cuenta desbloqueada correctamente"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new DesbloqueoResponse(false, "Token inválido o expirado"));
        }
    }
}