import { obtenerUsuarioActivo, cerrarSesion } from "../../modules/almacenaje.js";

document.addEventListener("DOMContentLoaded", cargarNavbar);

function cargarNavbar() {
    const contenedor = document.getElementById("navbar-container");
    if (!contenedor) return;

    fetch("/js/data/shared/navbar.html")
        .then((respuesta) => {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el navbar");
            }
            return respuesta.text();
        })
        .then(async (html) => {
            contenedor.innerHTML = html;
            await inicializarNavbar();
        })
        .catch((error) => {
            console.error("Error al cargar el navbar:", error);
        });
}

async function inicializarNavbar() {
    const usuario = await obtenerUsuarioActivo();
    const nombreUsuario = document.getElementById("navbar-usuario");
    const avatarUsuario = document.querySelector(".user-avatar");
    const btnLogout = document.getElementById("btnLogout");

    if (nombreUsuario) {
        nombreUsuario.textContent = usuario ? usuario.nombre : "-no login-";
    }

    if (avatarUsuario) {
        avatarUsuario.textContent = usuario?.nombre
            ? usuario.nombre.charAt(0).toUpperCase()
            : "U";
    }

    if (btnLogout) {
        btnLogout.style.display = usuario ? "inline-block" : "none";

        btnLogout.addEventListener("click", function () {
            cerrarSesion();
            window.location.href = "login.html";
        });
    }
}