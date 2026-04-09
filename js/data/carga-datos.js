import {
    addUser,
    getUserByEmail,
    addOferta,
    getOfertas
} from "../modules/almacenaje.js";

const usuariosDemo = [
    {
        nombre: "Carlos Pérez",
        dni: "23456789B",
        email: "carlos@example.com",
        telefono: "611222333",
        password: "carlos123"
    },
    {
        nombre: "Laura Gómez",
        dni: "34567890C",
        email: "laura@example.com",
        telefono: "622333444",
        password: "laura123"
    },
    {
        nombre: "Tech Solutions RRHH",
        dni: "45678901D",
        email: "rrhh@techsolutions.com",
        telefono: "633444555",
        password: "tech1234"
    }
];

const publicacionesDemo = [
    {
        tipo: "oferta",
        titulo: "Desarrollador Frontend Junior",
        entidad: "Tech Solutions",
        ubicacion: "Barcelona, España",
        modalidad: "Híbrido",
        descripcion: "Buscamos desarrollador frontend junior con conocimientos en HTML, CSS, JavaScript y trabajo con interfaces responsive.",
        salario: "22000€ - 26000€",
        usuarioEmail: "rrhh@techsolutions.com",
        usuarioNombre: "Tech Solutions RRHH",
        fechaCreacion: "2026-04-09T09:00:00.000Z"
    },
    {
        tipo: "oferta",
        titulo: "Programador Java",
        entidad: "CodeFactory",
        ubicacion: "Madrid, España",
        modalidad: "Remoto",
        descripcion: "Empresa tecnológica busca programador Java con conocimientos de POO, bases de datos y desarrollo de aplicaciones.",
        salario: "26000€ - 32000€",
        usuarioEmail: "rrhh@techsolutions.com",
        usuarioNombre: "Tech Solutions RRHH",
        fechaCreacion: "2026-04-09T10:00:00.000Z"
    },
    {
        tipo: "demanda",
        titulo: "Diseñador UX/UI Junior",
        entidad: "Carlos Pérez",
        ubicacion: "Valencia, España",
        modalidad: "Remoto",
        descripcion: "Perfil junior orientado al diseño de interfaces limpias, accesibles y adaptadas a distintos dispositivos.",
        salario: "18000€ - 22000€",
        usuarioEmail: "carlos@example.com",
        usuarioNombre: "Carlos Pérez",
        fechaCreacion: "2026-04-09T12:00:00.000Z"
    },
    {
        tipo: "oferta",
        titulo: "Técnico de soporte informático",
        entidad: "NetHelp",
        ubicacion: "Sevilla, España",
        modalidad: "Presencial",
        descripcion: "Se necesita técnico de soporte para resolución de incidencias, mantenimiento de equipos y atención a usuarios.",
        salario: "20000€ - 24000€",
        usuarioEmail: "rrhh@techsolutions.com",
        usuarioNombre: "Tech Solutions RRHH",
        fechaCreacion: "2026-04-09T13:00:00.000Z"
    }
];

async function cargarUsuariosDemo() {
    for (const usuario of usuariosDemo) {
        const existente = await getUserByEmail(usuario.email);

        if (!existente) {
            await addUser(usuario);
        }
    }
}

async function cargarPublicacionesDemo() {
    const publicacionesExistentes = await getOfertas();

    if (Array.isArray(publicacionesExistentes) && publicacionesExistentes.length > 0) {
        return;
    }

    for (const publicacion of publicacionesDemo) {
        await addOferta(publicacion);
    }
}

export async function cargarDatosIniciales() {
    try {
        await cargarUsuariosDemo();
        await cargarPublicacionesDemo();
        console.log("Datos iniciales cargados correctamente en IndexedDB.");
    } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
    }
}