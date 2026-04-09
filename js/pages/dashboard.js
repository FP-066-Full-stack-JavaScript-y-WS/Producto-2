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
const zonaOfertas = document.getElementById("zona-ofertas");
const zonaDemandas = document.getElementById("zona-demandas");
const contenedorOfertas = document.getElementById("contenedor-ofertas");
const contenedorDemandas = document.getElementById("contenedor-demandas");

const btnPublicar = document.getElementById("btn-publicar");

let tarjetaArrastrada = null; // Variable para almacenar la tarjeta que se está arrastrando
/*=====================================================================
    2. FUNCIONES DE VISUALIZACIÓN
=====================================================================*/

function crearTarjeta(anuncio, tipo) {
    const esOferta = tipo === "OFERTA";

    return `
        <div class="col-md-6 col-xl-4">
            <article 
                class="dashboard-item ${esOferta ? "dashboard-item-oferta" : "dashboard-item-demanda"} tarjeta-arrastrable"
                draggable="true"
                data-id="${anuncio.id}"
                data-tipo="${tipo}"
                data-titulo="${anuncio.titulo ?? ""}"
                data-entidad="${anuncio.entidad ?? ""}"
                data-ubicacion="${anuncio.ubicacion ?? ""}"
                data-modalidad="${anuncio.modalidad ?? ""}"
                data-fecha="${anuncio.fechaCreacion ?? ""}"
                data-descripcion="${anuncio.descripcion ?? ""}"
                data-salario="${anuncio.salario ?? ""}"
                data-email="${anuncio.usuarioEmail ?? ""}"
                data-nombre="${anuncio.usuarioNombre ?? ""}"
            >
                <span class="dashboard-badge ${esOferta ? "badge-oferta" : "badge-demanda"}">
                    ${esOferta ? "Oferta de empleo" : "Demanda de empleo"}
                </span>

                <h3 class="dashboard-item-title">
                    ${anuncio.titulo ?? "Sin título"}
                </h3>

                <p class="dashboard-item-entity">
                    ${anuncio.entidad ?? "Sin entidad"}
                </p>

                <p class="dashboard-item-meta">
                    <i class="bi bi-geo-alt"></i>
                    ${anuncio.ubicacion ?? "Ubicación no disponible"}
                </p>

                <p class="dashboard-item-meta">
                    <i class="bi bi-briefcase"></i>
                    ${anuncio.modalidad ?? "Modalidad no especificada"}
                </p>

                <p class="dashboard-item-meta">
                    <i class="bi bi-cash-stack"></i>
                    ${anuncio.salario ?? "Salario no especificado"}
                </p>

                <p class="dashboard-item-description">
                    ${anuncio.descripcion ?? "Sin descripción"}
                </p>

                <p class="dashboard-item-user">
                    ${anuncio.usuarioNombre ?? anuncio.usuarioEmail ?? "Usuario no disponible"}
                </p>
            </article>
        </div>
    `;
}

function crearTarjetaOferta(oferta) {
    return crearTarjeta(oferta, "OFERTA");
}

function crearTarjetaDemanda(demanda) {
    return crearTarjeta(demanda, "DEMANDA");
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
}

function activarDragAndDrop() {
    const zonaSeleccion = document.getElementById("zona-seleccion");

    document.addEventListener("dragstart", function (event) {
        const tarjeta = event.target.closest(".tarjeta-arrastrable");
        if (!tarjeta) return;

        tarjetaArrastrada = tarjeta;
        event.dataTransfer.setData("text/plain", tarjeta.dataset.id);
    });

    document.addEventListener("dragend", function () {
        tarjetaArrastrada = null;
    });

    function permitirDrop(contenedor) {
        if (!contenedor) return;

        contenedor.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
    }

    function crearColumnaTarjeta(tipo, id, titulo, entidad, ubicacion, modalidad, fecha, descripcion, salario, email, nombre, claseColumna) {
        const columna = document.createElement("div");
        columna.className = claseColumna;

        columna.innerHTML = `
        <article 
            class="dashboard-item ${tipo === "OFERTA" ? "dashboard-item-oferta" : "dashboard-item-demanda"} tarjeta-arrastrable"
            draggable="true"
            data-id="${id}"
            data-tipo="${tipo}"
            data-titulo="${titulo || ""}"
            data-entidad="${entidad || ""}"
            data-ubicacion="${ubicacion || ""}"
            data-modalidad="${modalidad || ""}"
            data-fecha="${fecha || ""}"
            data-descripcion="${descripcion || ""}"
            data-salario="${salario || ""}"
            data-email="${email || ""}"
            data-nombre="${nombre || ""}"
        >
            <span class="dashboard-badge ${tipo === "OFERTA" ? "badge-oferta" : "badge-demanda"}">
                ${tipo === "OFERTA" ? "Oferta de empleo" : "Demanda de empleo"}
            </span>

            <h3 class="dashboard-item-title">
                ${titulo || "Sin título"}
            </h3>

            <p class="dashboard-item-entity">
                ${entidad || "Sin entidad"}
            </p>

            <p class="dashboard-item-meta">
                <i class="bi bi-geo-alt"></i>
                ${ubicacion || "Ubicación no disponible"}
            </p>

            <p class="dashboard-item-meta">
                <i class="bi bi-briefcase"></i>
                ${modalidad || "Modalidad no especificada"}
            </p>

            <p class="dashboard-item-meta">
                <i class="bi bi-cash-stack"></i>
                ${salario || "Salario no especificado"}
            </p>

            <p class="dashboard-item-description">
                ${descripcion || "Sin descripción"}
            </p>

            <p class="dashboard-item-user">
                ${nombre || email || "Usuario no disponible"}
            </p>
        </article>
    `;

        return columna;
    }

    function actualizarMensajeSeleccion() {
        if (!zonaSeleccion) return;

        const hayTarjetas = zonaSeleccion.querySelector(".dashboard-item");
        const mensajeExistente = document.getElementById("mensaje-seleccion");

        if (!hayTarjetas && !mensajeExistente) {
            zonaSeleccion.innerHTML = `
                <div class="col-12 text-muted" id="mensaje-seleccion">
                    Arrastra aquí los anuncios seleccionados.
                </div>
            `;
        }

        if (hayTarjetas && mensajeExistente) {
            mensajeExistente.remove();
        }
    }

    function actualizarMensajesDisponibles() {
        if (contenedorOfertas && !contenedorOfertas.querySelector(".dashboard-item")) {
            contenedorOfertas.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-light border text-center">
                        No hay ofertas registradas.
                    </div>
                </div>
            `;
        }

        if (contenedorDemandas && !contenedorDemandas.querySelector(".dashboard-item")) {
            contenedorDemandas.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-light border text-center">
                        No hay demandas registradas.
                    </div>
                </div>
            `;
        }
    }

    function moverTarjeta(destinoContenedor) {
        if (!tarjetaArrastrada || !destinoContenedor) return;

        const id = tarjetaArrastrada.dataset.id;
        const tipo = tarjetaArrastrada.dataset.tipo;
        const titulo = tarjetaArrastrada.dataset.titulo;
        const entidad = tarjetaArrastrada.dataset.entidad;
        const ubicacion = tarjetaArrastrada.dataset.ubicacion;
        const modalidad = tarjetaArrastrada.dataset.modalidad;
        const fecha = tarjetaArrastrada.dataset.fecha;
        const descripcion = tarjetaArrastrada.dataset.descripcion;
        const salario = tarjetaArrastrada.dataset.salario;
        const email = tarjetaArrastrada.dataset.email;
        const nombre = tarjetaArrastrada.dataset.nombre;

        const yaExiste = destinoContenedor.querySelector(`[data-id="${id}"][data-tipo="${tipo}"]`);
        if (yaExiste) {
            tarjetaArrastrada = null;
            return;
        }

        const columnaOriginal = tarjetaArrastrada.closest(".col-12, .col-md-6, .col-xl-4");
        if (columnaOriginal) {
            columnaOriginal.remove();
        }

        const alertaVacia = destinoContenedor.querySelector(".alert");
        if (alertaVacia) {
            const colAlerta = alertaVacia.closest(".col-12");
            if (colAlerta) {
                colAlerta.remove();
            }
        }

        let nuevaColumna;

        if (destinoContenedor === zonaSeleccion) {
            nuevaColumna = crearColumnaTarjeta(
                tipo,
                id,
                titulo,
                entidad,
                ubicacion,
                modalidad,
                fecha,
                descripcion,
                salario,
                email,
                nombre,
                "col-12"
            );
        } else {
            nuevaColumna = crearColumnaTarjeta(
                tipo,
                id,
                titulo,
                entidad,
                ubicacion,
                modalidad,
                fecha,
                descripcion,
                salario,
                email,
                nombre,
                "col-md-6 col-xl-4"
            );
        }

        destinoContenedor.appendChild(nuevaColumna);
        actualizarMensajeSeleccion();
        actualizarMensajesDisponibles();
        tarjetaArrastrada = null;
    }

    permitirDrop(zonaSeleccion);
    permitirDrop(zonaOfertas);
    permitirDrop(zonaDemandas);

    if (zonaSeleccion) {
        zonaSeleccion.addEventListener("drop", function (event) {
            event.preventDefault();
            moverTarjeta(zonaSeleccion);
        });
    }

    if (zonaOfertas) {
        zonaOfertas.addEventListener("drop", function (event) {
            event.preventDefault();

            if (!tarjetaArrastrada) return;
            if (tarjetaArrastrada.dataset.tipo !== "OFERTA") return;

            moverTarjeta(contenedorOfertas);
        });
    }

    if (zonaDemandas) {
        zonaDemandas.addEventListener("drop", function (event) {
            event.preventDefault();

            if (!tarjetaArrastrada) return;
            if (tarjetaArrastrada.dataset.tipo !== "DEMANDA") return;

            moverTarjeta(contenedorDemandas);
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