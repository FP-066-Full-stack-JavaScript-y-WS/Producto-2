import { addOferta, deleteOferta, getActiveUser, getOfertas } from "../modules/almacenaje.js";

const form = document.getElementById("form-ofertas");
const tablaGestion = document.getElementById("tabla-gestion");
const totalBadge = document.getElementById("total-badge");

function validarSalario(min, max) {
    if ((min && Number(min) < 0) || (max && Number(max) < 0)) {
        return "El salario no puede ser negativo.";
    }
    if (min && max && Number(min) > Number(max)) {
        return "El salario mínimo no puede ser mayor que el máximo.";
    }
    return null;
}

function formatearSalario(min, max) {
    if (!min && !max) {
        return "No especificado";
    }
    if (min && !max) {
        return `${min}€`;
    }
    if (!min && max) {
        return `${max}€`;
    }
    return `${min}€ - ${max}€`;
}

function renderizarLista(ofertas = []) {
    if (!tablaGestion) {
        return;
    }

    if (totalBadge) {
        totalBadge.textContent = `${ofertas.length} anuncios`;
    }

    if (!ofertas.length) {
        tablaGestion.innerHTML = `
            <tr>
                <td colspan="3" class="text-center text-muted">Todavía no hay publicaciones registradas.</td>
            </tr>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    ofertas.forEach((oferta) => {
        const fila = document.createElement("tr");
        const tipo = oferta.tipo === "demanda" ? "demanda" : "oferta";
        const badgeColor = tipo === "oferta" ? "text-primary bg-primary-subtle" : "text-purple bg-purple-subtle";

        fila.innerHTML = `
            <td>
                <span class="badge ${badgeColor} border-0 px-2 py-1" style="font-size: 0.65rem;">${tipo.toUpperCase()}</span>
            </td>
            <td>
                <div class="fw-bold small mb-0">${oferta.titulo}</div>
                <div class="text-muted" style="font-size: 0.8rem;">${oferta.entidad || "Sin entidad"}</div>
            </td>
            <td class="text-end">
                <button class="btn btn-link text-danger p-0" data-action="delete" data-id="${oferta.id}">
                    <i class="bi bi-trash3-fill" style="font-size: 1.1rem;"></i>
                </button>
            </td>
        `;

        fragment.appendChild(fila);
    });

    tablaGestion.innerHTML = "";
    tablaGestion.appendChild(fragment);
}

async function cargarOfertas() {
    try {
        const registros = await getOfertas();
        const ordenados = registros.sort((a, b) => (b.id || 0) - (a.id || 0));
        renderizarLista(ordenados);
    } catch (error) {
        console.error(error);
        renderizarLista();
        alert("No se pudieron cargar las publicaciones. Inténtalo de nuevo más tarde.");
    }
}

async function manejarAlta(event) {
    event.preventDefault();

    const tipo = document.querySelector("input[name='tipo_pub']:checked")?.value || "oferta";
    const titulo = document.getElementById("titulo")?.value.trim();
    const entidad = document.getElementById("entidad")?.value.trim();
    const ubicacion = document.getElementById("ubicacion")?.value.trim();
    const modalidad = document.getElementById("modalidad")?.value;
    const descripcion = document.getElementById("descripcion")?.value.trim();
    const salarioMin = document.getElementById("salario_min")?.value;
    const salarioMax = document.getElementById("salario_max")?.value;

    if (!titulo || !entidad || !ubicacion || !modalidad || !descripcion) {
        alert("Todos los campos obligatorios deben estar completos.");
        return;
    }

    const salarioError = validarSalario(salarioMin, salarioMax);
    if (salarioError) {
        alert(salarioError);
        return;
    }

    try {
        const registro = {
            tipo,
            titulo,
            entidad,
            ubicacion,
            modalidad,
            descripcion,
            salario: formatearSalario(salarioMin, salarioMax),
            usuarioEmail: getActiveUser() || null,
            fechaCreacion: new Date().toISOString()
        };

        await addOferta(registro);
        form?.reset();
        restablecerSelector();
        await cargarOfertas();
        alert("Publicación creada correctamente.");
    } catch (error) {
        console.error(error);
        alert("No se pudo guardar la publicación. Inténtalo de nuevo.");
    }
}

async function manejarBorrado(event) {
    const boton = event.target.closest("[data-action='delete']");
    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    if (!id) {
        return;
    }

    const confirmado = confirm("¿Deseas eliminar esta publicación?");
    if (!confirmado) {
        return;
    }

    try {
        await deleteOferta(id);
        await cargarOfertas();
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar la publicación. Inténtalo de nuevo.");
    }
}

function restablecerSelector() {
    const radioOferta = document.getElementById("tipo_oferta");
    if (radioOferta) {
        radioOferta.checked = true;
    }
    actualizarSelectorVisual();
}

function actualizarSelectorVisual() {
    const radioOferta = document.getElementById("tipo_oferta");
    const radioDemanda = document.getElementById("tipo_demanda");
    const labelEntidad = document.getElementById("label_entidad");

    if (!radioOferta || !radioDemanda || !labelEntidad) {
        return;
    }

    const boxOferta = radioOferta.nextElementSibling;
    const boxDemanda = radioDemanda.nextElementSibling;

    if (boxOferta) {
        boxOferta.classList.toggle("active", radioOferta.checked);
    }
    if (boxDemanda) {
        boxDemanda.classList.toggle("active", radioDemanda.checked);
    }

    labelEntidad.innerText = radioOferta.checked ? "Nombre de la empresa *" : "Tu nombre completo *";
}

function activarSelectorTipoPublicacion() {
    const radioOferta = document.getElementById("tipo_oferta");
    const radioDemanda = document.getElementById("tipo_demanda");

    if (!radioOferta || !radioDemanda) {
        return;
    }

    [radioOferta, radioDemanda].forEach((input) => {
        input.addEventListener("change", actualizarSelectorVisual);
        const caja = input.nextElementSibling;
        if (caja) {
            caja.addEventListener("click", () => {
                input.checked = true;
                actualizarSelectorVisual();
            });
        }
    });

    actualizarSelectorVisual();
}

function init() {
    if (!form || !tablaGestion) {
        return;
    }

    form.addEventListener("submit", manejarAlta);
    tablaGestion.addEventListener("click", manejarBorrado);
    activarSelectorTipoPublicacion();
    cargarOfertas();
}

init();