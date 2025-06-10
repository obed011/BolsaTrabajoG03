package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Controller;

import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.LoginRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.RegisterEmpresaRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.RegisterPostulanteRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response.ApiResponse;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response.AuthResponse;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            return ResponseEntity.ok(new ApiResponse(true, "Login exitoso", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterPostulanteRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Registro exitoso", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/register-empresa")
    public ResponseEntity<?> registerEmpresa(@Valid @RequestBody RegisterEmpresaRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.registerEmpresa(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Registro de empresa exitoso", authResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // En JWT no necesitamos hacer nada en el servidor para logout
        // El cliente simplemente debe eliminar el token
        return ResponseEntity.ok(new ApiResponse(true, "Logout exitoso"));
    }
}
