import { loguearUsuario } from "../modules/almacenaje.js";
import { cargarDatosIniciales } from "../data/carga-datos.js";

const formulario = document.getElementById("loginForm");
const contenedorMensaje = document.getElementById("loginMensaje");

document.addEventListener("DOMContentLoaded", async function () {
    await cargarDatosIniciales();
});

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const resultado = await loguearUsuario(email, password);

        if (!resultado.ok) {
            mostrarMensaje(resultado.mensaje, "danger");
            return;
        }

        mostrarMensaje(resultado.mensaje, "success");
        formulario.reset();

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1500);

    } catch (error) {
        mostrarMensaje("Error al iniciar sesión. Inténtalo de nuevo.", "danger");
        console.error("Error en login:", error);
    }
});

function mostrarMensaje(texto, tipo) {
    contenedorMensaje.innerHTML = `
        <div class="alert alert-${tipo}" role="alert">
            ${texto}
        </div>
    `;
}