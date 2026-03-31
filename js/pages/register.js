import { addUser, getUserByEmail, setActiveUser } from "../modules/almacenaje.js";

const formulario = document.getElementById("registerForm");
const contenedorMensaje = document.getElementById("registerMensaje");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const dni = document.getElementById("dni").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!nombre || !dni || !email || !telefono || !password || !confirmPassword) {
        mostrarMensaje("Todos los campos son obligatorios.", "danger");
        return;
    }

    if (password !== confirmPassword) {
        mostrarMensaje("Las contraseñas no coinciden.", "danger");
        return;
    }

    if (password.length < 8) {
        mostrarMensaje("La contraseña debe tener al menos 8 caracteres.", "danger");
        return;
    }

    try {
        const usuarioExistente = await getUserByEmail(email);
        if (usuarioExistente) {
            mostrarMensaje("Ya existe un usuario con ese email.", "danger");
            return;
        }

        const nuevoUsuario = {
            nombre,
            dni,
            email,
            telefono,
            password
        };

        await addUser(nuevoUsuario);
        setActiveUser(email);

        mostrarMensaje("Registro exitoso. Redirigiendo...", "success");
        formulario.reset();

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1500);

    } catch (error) {
        console.error("Error en registro:", error);
        mostrarMensaje("Error al registrar el usuario. Inténtalo de nuevo.", "danger");
    }
});

function mostrarMensaje(texto, tipo) {
    contenedorMensaje.innerHTML = `<div class="alert alert-${tipo}" role="alert">${texto}</div>`;
}


/*

Prompts IA. IA Usada: ChatGPT
 
- Cómo puedo mostrar mensajes de error o éxito sin que se recargue la página?
- Puedo hacer que los campos del formulario no se borren si hay un error? Para que el usuario los pueda revisar.
- Cómo puedo comprobar que se están enviando bien los datos?
- Necesito comprobar que las contraseñas coinciden antes de registrar al usuario

*/