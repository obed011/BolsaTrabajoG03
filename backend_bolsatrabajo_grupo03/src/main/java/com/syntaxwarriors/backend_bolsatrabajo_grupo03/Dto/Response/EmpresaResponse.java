package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response;
import lombok.Data;

@Data
public class EmpresaResponse {
    private Integer idEmpresa;
    private String nombreEmpresa;
    private String nitEmpresa;
    private String rubroEmpresa;
    private String telefonoEmpresa;
    private String direccionEmpresa;
    private String descripcion;
    private String sitioWeb;
}
