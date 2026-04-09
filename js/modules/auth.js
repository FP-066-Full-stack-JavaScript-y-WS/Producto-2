import { usuarios } from "../data/datos.js";

const CLAVE_USUARIO_ACTUAL = "usuarioActivo";

function obtenerUsuarios() {
    return usuarios;
}

export function registrarUsuario(datosFormulario) {
    const { nombre, dni, email, telefono, password, confirmPassword } = datosFormulario;

    if (!nombre || !dni || !email || !telefono || !password || !confirmPassword) {
        return { 
            ok: false, 
            mensaje: "Todos los campos son obligatorios." };
    }

    if (password.length < 8) {
        return {
            ok: false,
            mensaje: "La contraseña debe tener al menos 8 caracteres."   
        };
    }

    if (password !== confirmPassword) {
        return {
            ok: false,
            mensaje: "Las contraseñas no coinciden."
        };
    }

    const listaUsuarios = obtenerUsuarios();

    const emailExiste = listaUsuarios.some(function (usuario) {
        return usuario.email.toLowerCase() === email.toLowerCase();
    });

    if (emailExiste) {
        return {
            ok: false,
            mensaje: "El email ya está registrado."
        };
    }

    const nuevoId = listaUsuarios.length > 0 ? listaUsuarios[listaUsuarios.length - 1].id + 1 : 1;

    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        dni,
        email,
        telefono,
        password
    };

  listaUsuarios.push(nuevoUsuario);

    return {
        ok: true,
        usuario: nuevoUsuario,
        mensaje: "Usuario registrado correctamente."
    };
}

export function iniciarSesion(email, password) {
    if (!email || !password) {
        return {
            ok: false,
            mensaje: "Debes completar email y contraseña."
        };
    }

    const listaUsuarios = obtenerUsuarios();

    const usuarioEncontrado = listaUsuarios.find(function (usuario) {
        return usuario.email.toLowerCase() === email.toLowerCase() &&
               usuario.password === password;
    });

    if (!usuarioEncontrado) {
        return {
            ok: false,
            mensaje: "Email o contraseña incorrectos."
        };
    }

   localStorage.setItem(CLAVE_USUARIO_ACTUAL, JSON.stringify(usuarioEncontrado));

    return {
        ok: true,
        usuario: usuarioEncontrado,
        mensaje: `Bienvenido/a, ${usuarioEncontrado.nombre}.`
    };
}

export function obtenerUsuarioActual() {
    const usuarioGuardado = localStorage.getItem(CLAVE_USUARIO_ACTUAL);

    if (!usuarioGuardado) {
        return null;
    }

    return JSON.parse(usuarioGuardado);
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVE_USUARIO_ACTUAL);
}

export function haySesionActiva() {
    return obtenerUsuarioActual() !== null;
}