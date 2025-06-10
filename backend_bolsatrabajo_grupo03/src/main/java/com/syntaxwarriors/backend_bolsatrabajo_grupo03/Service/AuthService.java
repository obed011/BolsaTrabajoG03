package com.syntaxwarriors.backend_bolsatrabajo_grupo03.Service;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.LoginRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.RegisterPostulanteRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Request.RegisterEmpresaRequest;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response.AuthResponse;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response.PostulanteResponse;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Dto.Response.EmpresaResponse;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Usuario;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Postulante;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Empresa;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Models.Rol;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.PostulanteRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.EmpresaRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.RolRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Repository.UsuarioRepository;
import com.syntaxwarriors.backend_bolsatrabajo_grupo03.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PostulanteRepository postulanteRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getCorreo(),
                            loginRequest.getContrasena()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getCorreo());
        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario usuario = usuarioRepository.findByCorreo(loginRequest.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PostulanteResponse postulanteResponse = null;
        EmpresaResponse empresaResponse = null;

        if ("POSTULANTE".equals(usuario.getRol().getNombreRol())) {
            Postulante postulante = postulanteRepository.findByUsuario(usuario)
                    .orElse(null);
            if (postulante != null) {
                postulanteResponse = mapToPostulanteResponse(postulante);
            }
        } else if ("EMPRESA".equals(usuario.getRol().getNombreRol())) {
            Empresa empresa = empresaRepository.findByUsuario(usuario)
                    .orElse(null);
            if (empresa != null) {
                empresaResponse = mapToEmpresaResponse(empresa);
            }
        }

        return new AuthResponse(jwt, usuario.getCorreo(), usuario.getRol().getNombreRol(), postulanteResponse, empresaResponse);
    }

    @Transactional
    public AuthResponse register(RegisterPostulanteRequest registerRequest) {
        // Verificar si el correo ya existe
        if (usuarioRepository.existsByCorreo(registerRequest.getCorreo())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        // Buscar el rol de postulante
        Rol rolPostulante = rolRepository.findByNombreRol("POSTULANTE")
                .orElseThrow(() -> new RuntimeException("Rol POSTULANTE no encontrado"));

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setCorreo(registerRequest.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(registerRequest.getContrasena()));
        usuario.setRol(rolPostulante);
        usuario.setEstado(true);

        usuario = usuarioRepository.save(usuario);

        // Crear postulante
        Postulante postulante = new Postulante();
        postulante.setUsuario(usuario);
        postulante.setNombres(registerRequest.getNombres());
        postulante.setApellidos(registerRequest.getApellidos());
        postulante.setTelefono(registerRequest.getTelefono());
        postulante.setFechaNacimiento(registerRequest.getFechaNacimiento());
        postulante.setDireccion(registerRequest.getDireccion());
        postulante.setGenero(registerRequest.getGenero());

        postulante = postulanteRepository.save(postulante);

        // Generar token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getCorreo());
        final String jwt = jwtUtil.generateToken(userDetails);

        PostulanteResponse postulanteResponse = mapToPostulanteResponse(postulante);

        return new AuthResponse(jwt, usuario.getCorreo(), usuario.getRol().getNombreRol(), postulanteResponse);
    }
    @Transactional
    public AuthResponse registerEmpresa(RegisterEmpresaRequest registerRequest) {
        // Verificar si el correo ya existe
        if (usuarioRepository.existsByCorreo(registerRequest.getCorreo())) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }

        // Verificar si el NIT ya está registrado
        if (registerRequest.getNitEmpresa() != null && !registerRequest.getNitEmpresa().isEmpty()) {
            if (empresaRepository.existsByNitEmpresa(registerRequest.getNitEmpresa())) {
                throw new RuntimeException("El RUC ya está registrado");
            }
        }

        // Buscar el rol de empresa
        Rol rolEmpresa = rolRepository.findByNombreRol("EMPRESA")
                .orElseThrow(() -> new RuntimeException("Rol EMPRESA no encontrado"));

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setCorreo(registerRequest.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(registerRequest.getContrasena()));
        usuario.setRol(rolEmpresa);
        usuario.setEstado(true);

        usuario = usuarioRepository.save(usuario);

        // Crear empresa
        Empresa empresa = new Empresa();
        empresa.setUsuario(usuario);
        empresa.setNombreEmpresa(registerRequest.getNombreEmpresa());
        empresa.setNitEmpresa(registerRequest.getNitEmpresa());
        empresa.setRubroEmpresa(registerRequest.getRubroEmpresa());
        empresa.setTelefonoEmpresa(registerRequest.getTelefonoEmpresa());
        empresa.setDireccionEmpresa(registerRequest.getDireccionEmpresa());
        empresa.setDescripcion(registerRequest.getDescripcion());
        empresa.setSitioWeb(registerRequest.getSitioWeb());

        empresa = empresaRepository.save(empresa);

        // Generar token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getCorreo());
        final String jwt = jwtUtil.generateToken(userDetails);

        EmpresaResponse empresaResponse = mapToEmpresaResponse(empresa);

        return new AuthResponse(jwt, usuario.getCorreo(), usuario.getRol().getNombreRol(), empresaResponse);
    }

    private PostulanteResponse mapToPostulanteResponse(Postulante postulante) {
        PostulanteResponse response = new PostulanteResponse();
        response.setIdPostulante(postulante.getIdPostulante());
        response.setNombres(postulante.getNombres());
        response.setApellidos(postulante.getApellidos());
        response.setTelefono(postulante.getTelefono());
        response.setFechaNacimiento(postulante.getFechaNacimiento());
        response.setDireccion(postulante.getDireccion());
        response.setGenero(postulante.getGenero());
        return response;
    }

    private EmpresaResponse mapToEmpresaResponse(Empresa empresa) {
        EmpresaResponse response = new EmpresaResponse();
        response.setIdEmpresa(empresa.getIdEmpresa());
        response.setNombreEmpresa(empresa.getNombreEmpresa());
        response.setNitEmpresa(empresa.getNitEmpresa());
        response.setRubroEmpresa(empresa.getRubroEmpresa());
        response.setTelefonoEmpresa(empresa.getTelefonoEmpresa());
        response.setDireccionEmpresa(empresa.getDireccionEmpresa());
        response.setDescripcion(empresa.getDescripcion());
        response.setSitioWeb(empresa.getSitioWeb());
        return response;
    }
}
