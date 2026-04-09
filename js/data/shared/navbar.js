import { obtenerUsuarioActivo, cerrarSesion } from "../../modules/almacenaje.js";

document.addEventListener("DOMContentLoaded", cargarNavbar);

function cargarNavbar() {
    const contenedor = document.getElementById("navbar-container");
    if (!contenedor) return;

    fetch("/js/data/shared/navbar.html")
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el navbar");
            }

            return respuesta.text();
        })
        .then(async function (html) {
            contenedor.innerHTML = html;
            await inicializarNavbar();
        })
        .catch(function (error) {
            console.error("Error al cargar el navbar:", error);
        });
}

async function inicializarNavbar() {
    const usuario = await obtenerUsuarioActivo();
    const nombre = document.getElementById("navbar-usuario");

    if (nombre) {
        nombre.textContent = usuario ? usuario.nombre : "-no login-";
    }

    const btnLogout = document.getElementById("btnLogout");

    if (btnLogout) {
        btnLogout.addEventListener("click", function () {
            cerrarSesion();
            window.location.href = "login.html";
        });
    }
}