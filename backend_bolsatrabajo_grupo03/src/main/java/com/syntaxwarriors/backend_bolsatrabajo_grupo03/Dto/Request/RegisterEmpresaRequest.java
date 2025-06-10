package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterEmpresaRequest {
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contrasena;

    @NotBlank(message = "El nombre de la empresa es obligatorio")
    private String nombreEmpresa;

    private String nitEmpresa;

    @NotBlank(message = "El rubro de la empresa es obligatorio")
    private String rubroEmpresa;

    private String telefonoEmpresa;
    private String direccionEmpresa;
    private String descripcion;
    private String sitioWeb;

}
