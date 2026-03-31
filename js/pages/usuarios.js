import { addUser, deleteUser, getUserByEmail, getUsers } from "../modules/almacenaje.js";

const formUsuario = document.getElementById("formUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");

function validarFormulario(nombre, email, password) {
    if (!nombre || !email || !password) {
        return "Todos los campos son obligatorios.";
    }
    if (!email.includes("@")) {
        return "El email no tiene un formato válido.";
    }
    if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
    }
    return null;
}

function renderUsuarios(usuarios = []) {
    if (!listaUsuarios) {
        return;
    }

    if (!usuarios.length) {
        listaUsuarios.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">No hay usuarios registrados todavía.</td>
            </tr>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    usuarios.forEach((usuario) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${usuario.nombre}</td>
            <td class="col-email">${usuario.email}</td>
            <td>********</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" data-action="delete" data-email="${usuario.email}">
                    Eliminar
                </button>
            </td>
        `;
        fragment.appendChild(fila);
    });

    listaUsuarios.innerHTML = "";
    listaUsuarios.appendChild(fragment);
}

async function cargarUsuarios() {
    try {
        const usuarios = await getUsers();
        renderUsuarios(usuarios);
    } catch (error) {
        console.error(error);
        renderUsuarios();
        alert("No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.");
    }
}

async function manejarAltaUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre")?.value.trim();
    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const password = document.getElementById("password")?.value.trim();

    const error = validarFormulario(nombre, email, password);
    if (error) {
        alert(error);
        return;
    }

    try {
        const usuarioExistente = await getUserByEmail(email);
        if (usuarioExistente) {
            alert("Ya existe un usuario registrado con ese email.");
            return;
        }

        await addUser({ nombre, email, password });
        formUsuario?.reset();
        await cargarUsuarios();
        alert("Usuario registrado correctamente.");
    } catch (err) {
        console.error(err);
        alert("No se pudo registrar el usuario. Inténtalo de nuevo.");
    }
}

async function manejarBorrado(event) {
    const boton = event.target.closest("[data-action='delete']");
    if (!boton) {
        return;
    }

    const email = boton.dataset.email;
    if (!email) {
        return;
    }

    const confirmado = confirm("¿Deseas eliminar este usuario?");
    if (!confirmado) {
        return;
    }

    try {
        await deleteUser(email);
        await cargarUsuarios();
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el usuario. Inténtalo de nuevo.");
    }
}

function init() {
    if (!formUsuario || !listaUsuarios) {
        return;
    }

    formUsuario.addEventListener("submit", manejarAltaUsuario);
    listaUsuarios.addEventListener("click", manejarBorrado);
    cargarUsuarios();
}

init();