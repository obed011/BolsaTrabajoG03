package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tipo = "Bearer";
    private Integer idUsuario;
    private String correo;
    private String rol;
    private PostulanteResponse postulante;
    private EmpresaResponse empresa;

    public AuthResponse(String token, Integer idUsuario, String correo, String rol, PostulanteResponse postulante) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.correo = correo;
        this.rol = rol;
        this.postulante = postulante;
        this.empresa = null;
    }

    public AuthResponse(String token, Integer idUsuario, String correo, String rol, EmpresaResponse empresa) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.correo = correo;
        this.rol = rol;
        this.postulante = null;
        this.empresa = empresa;
    }

    public AuthResponse(String token, Integer idUsuario, String correo, String rol, PostulanteResponse postulante, EmpresaResponse empresa) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.correo = correo;
        this.rol = rol;
        this.postulante = postulante;
        this.empresa = empresa;
    }
}
