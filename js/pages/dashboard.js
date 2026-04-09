/*=====================================================================
    Archivo: dashboard.js
    Autor: NodeNinjas
    Descripción:
    Este archivo controla la lógica del dashboard principal.
    Su función es:
    - Pintar las tarjetas de ofertas desde IndexedDB
    - Pintar las tarjetas de demandas desde IndexedDB
    - Gestionar eventos básicos de los botones
=====================================================================*/

import { getOfertas } from "../modules/almacenaje.js";

/*=====================================================================
    1. REFERENCIAS A ELEMENTOS DEL DOM
=====================================================================*/
const contenedorOfertas = document.getElementById("contenedor-ofertas");
const contenedorDemandas = document.getElementById("contenedor-demandas");

const btnPublicar = document.getElementById("btn-publicar");
const btnVerOfertas = document.getElementById("btn-ver-ofertas");
const btnVerDemandas = document.getElementById("btn-ver-demandas");

let tarjetaArrastrada = null; // Variable para almacenar la tarjeta que se está arrastrando
/*=====================================================================
    2. FUNCIONES DE VISUALIZACIÓN
=====================================================================*/

function crearTarjetaOferta(oferta) {
    return `
        <div class="col-12">
            <article 
                class="dashboard-item tarjeta-arrastrable"
                draggable="true"
                data-id="${oferta.id}"
                data-tipo="OFERTA"
                data-titulo="${oferta.titulo ?? ""}"
                data-fecha="${oferta.fecha ?? ""}"
                data-descripcion="${oferta.descripcion ?? ""}"
                data-email="${oferta.email ?? ""}"
            >
                <h3 class="dashboard-item-title">
                    Oferta: ${oferta.titulo ?? "Sin título"}
                </h3>

                <p class="dashboard-item-date">
                    ${oferta.fecha ?? "Sin fecha"}
                </p>

                <p class="dashboard-item-description">
                    ${oferta.descripcion ?? "Sin descripción"}
                </p>

                <p class="dashboard-item-user">
                    Publicado por: ${oferta.email ?? "No disponible"}
                </p>
            </article>
        </div>
    `;
}

function crearTarjetaDemanda(demanda) {
    return `
        <div class="col-12">
            <article 
                class="dashboard-item tarjeta-arrastrable"
                draggable="true"
                data-id="${demanda.id}"
                data-tipo="DEMANDA"
                data-titulo="${demanda.titulo ?? ""}"
                data-fecha="${demanda.fecha ?? ""}"
                data-descripcion="${demanda.descripcion ?? ""}"
                data-email="${demanda.email ?? ""}"
            >
                <h3 class="dashboard-item-title">
                    Demanda: ${demanda.titulo ?? "Sin título"}
                </h3>

                <p class="dashboard-item-date">
                    ${demanda.fecha ?? "Sin fecha"}
                </p>

                <p class="dashboard-item-description">
                    ${demanda.descripcion ?? "Sin descripción"}
                </p>

                <p class="dashboard-item-user">
                    Publicado por: ${demanda.email ?? "No disponible"}
                </p>
            </article>
        </div>
    `;
}

function pintarOfertas(ofertas) {
    if (!contenedorOfertas) return;

    if (!ofertas.length) {
        contenedorOfertas.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light border text-center">
                    No hay ofertas registradas.
                </div>
            </div>
        `;
        return;
    }

    contenedorOfertas.innerHTML = ofertas
        .slice(0, 3)
        .map(crearTarjetaOferta)
        .join("");
}

function pintarDemandas(demandas) {
    if (!contenedorDemandas) return;

    if (!demandas.length) {
        contenedorDemandas.innerHTML = `
            <div class="col-12">
                <div class="alert alert-light border text-center">
                    No hay demandas registradas.
                </div>
            </div>
        `;
        return;
    }

    contenedorDemandas.innerHTML = demandas
        .slice(0, 3)
        .map(crearTarjetaDemanda)
        .join("");
}

async function cargarTarjetasDashboard() {
    try {
        const anuncios = await getOfertas();
        console.log("Anuncios cargados desde IndexedDB:", anuncios);

        const ofertas = anuncios.filter(function (anuncio) {
        return anuncio.tipo && anuncio.tipo.toUpperCase() === "OFERTA";
        });

        const demandas = anuncios.filter(function (anuncio) {
        return anuncio.tipo && anuncio.tipo.toUpperCase() === "DEMANDA";
        });

        pintarOfertas(ofertas);
        pintarDemandas(demandas);

    } catch (error) {
        console.error("Error cargando tarjetas del dashboard:", error);

        if (contenedorOfertas) {
            contenedorOfertas.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        Error al cargar las ofertas.
                    </div>
                </div>
            `;
        }

        if (contenedorDemandas) {
            contenedorDemandas.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center">
                        Error al cargar las demandas.
                    </div>
                </div>
            `;
        }
    }
}

/*=====================================================================
    3. FUNCIONES DE EVENTOS
=====================================================================*/

function activarEventos() {
    if (btnPublicar) {
        btnPublicar.addEventListener("click", () => {
            window.location.href = "ofertas.html";
        });
    }

    if (btnVerOfertas) {
        btnVerOfertas.addEventListener("click", () => {
            alert("Aquí se mostrarán todas las ofertas en la siguiente interfaz.");
        });
    }

    if (btnVerDemandas) {
        btnVerDemandas.addEventListener("click", () => {
            alert("Aquí se mostrarán todas las demandas en la siguiente interfaz.");
        });
    }

    document.addEventListener("click", (event) => {
        const botonOferta = event.target.closest(".ver-mas-oferta");
        const botonDemanda = event.target.closest(".ver-mas-demanda");

        if (botonOferta) {
            const id = botonOferta.dataset.id;
            alert(`Mostrando detalle de la oferta con ID ${id}.`);
        }

        if (botonDemanda) {
            const id = botonDemanda.dataset.id;
            alert(`Mostrando detalle de la demanda con ID ${id}.`);
        }
    });
}

function activarDragAndDrop() { // Función para activar el drag and drop en las tarjetas del dashboard
    const zonaSeleccion = document.getElementById("zona-seleccion");
    const mensajeSeleccion = document.getElementById("mensaje-seleccion");

    document.addEventListener("dragstart", function (event) {
        const tarjeta = event.target.closest(".tarjeta-arrastrable");

        if (!tarjeta) return;

        tarjetaArrastrada = tarjeta;
        event.dataTransfer.setData("text/plain", tarjeta.dataset.id);
    });

    if (zonaSeleccion) {
        zonaSeleccion.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        zonaSeleccion.addEventListener("drop", function (event) {
            event.preventDefault();

            if (!tarjetaArrastrada) return;

            const id = tarjetaArrastrada.dataset.id;
            const tipo = tarjetaArrastrada.dataset.tipo;
            const titulo = tarjetaArrastrada.dataset.titulo;
            const fecha = tarjetaArrastrada.dataset.fecha;
            const descripcion = tarjetaArrastrada.dataset.descripcion;

            const yaExiste = zonaSeleccion.querySelector(`[data-id="${id}"][data-tipo="${tipo}"]`);
            if (yaExiste) {
                tarjetaArrastrada = null;
                return;
            }

            const columna = document.createElement("div");
            columna.className = "col-12";

           columna.innerHTML = `
    <article class="dashboard-item" data-id="${id}" data-tipo="${tipo}">
        <h3 class="dashboard-item-title">
            ${tipo === "OFERTA" ? "Oferta" : "Demanda"}: ${titulo || "Sin título"}
        </h3>

        <p class="dashboard-item-date">
            ${fecha || "Sin fecha"}
        </p>

        <p class="dashboard-item-description">
            ${descripcion || "Sin descripción"}
        </p>

        <p class="dashboard-item-user">
            Publicado por: ${tarjetaArrastrada.dataset.email || "No disponible"}
        </p>
    </article>
`;

            if (mensajeSeleccion) {
                mensajeSeleccion.remove();
            }

            zonaSeleccion.appendChild(columna);
            tarjetaArrastrada = null;
        });
    }
}

/*=====================================================================
    4. FUNCIÓN PRINCIPAL
=====================================================================*/

async function iniciarDashboard() {
    await cargarTarjetasDashboard();
    activarEventos();
    activarDragAndDrop();
}

document.addEventListener("DOMContentLoaded", iniciarDashboard);

/* Prompts IA. IA Usada: ChatGPT

- Cómo puedo mostrar varias cards con los datos de ofertas y demandas a partir de un array de objetos?
- Necesito limitar la cantidad de cards que aparecen en el dashboard. cómo puedo mostrar solo las 3 primeras ofertas y demandas?
- Cómo puedo usar la misma estructura de tarjeta para ofertas y demandas sin repetir código?
- Quiero simular interacciones en mi aplicación (como ver detalles o navegar entre secciones) aunque todavía no tenga todas las páginas desarrolladas. ¿Cómo puedo hacerlo de forma sencilla mientras tanto?

*/