const DB_NAME = "empleoDB";
const DB_VERSION = 1;
const STORE_USUARIOS = "usuarios";
const STORE_OFERTAS = "ofertas";
const ACTIVE_USER_KEY = "usuarioActivo";

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_USUARIOS)) {
                db.createObjectStore(STORE_USUARIOS, { keyPath: "email" });
            }

            if (!db.objectStoreNames.contains(STORE_OFERTAS)) {
                db.createObjectStore(STORE_OFERTAS, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Error al abrir la base de datos"));
    });
}

// ======================================================
// CRUD DE USUARIOS
// ======================================================

export async function addUser(usuario) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USUARIOS, "readwrite");
        const store = transaction.objectStore(STORE_USUARIOS);
        const request = store.add(usuario);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error("Error al añadir el usuario"));
    });
}

export async function getUsers() {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USUARIOS, "readonly");
        const store = transaction.objectStore(STORE_USUARIOS);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Error al obtener los usuarios"));
    });
}

export async function getUserByEmail(email) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USUARIOS, "readonly");
        const store = transaction.objectStore(STORE_USUARIOS);
        const request = store.get(email);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(new Error("Error al obtener el usuario por email"));
    });
}

export async function deleteUser(email) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_USUARIOS, "readwrite");
        const store = transaction.objectStore(STORE_USUARIOS);
        const request = store.delete(email);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error("Error al eliminar el usuario"));
    });
}

export async function registrarUsuario(datosFormulario) {
    const { nombre, dni, email, telefono, password, confirmPassword } = datosFormulario;

    if (!nombre || !dni || !email || !telefono || !password || !confirmPassword) {
        return {
            ok: false,
            mensaje: "Todos los campos son obligatorios."
        };
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

    const usuarioExistente = await getUserByEmail(email);

    if (usuarioExistente) {
        return {
            ok: false,
            mensaje: "El email ya está registrado."
        };
    }

    const nuevoUsuario = {
        nombre,
        dni,
        email,
        telefono,
        password
    };

    try {
        await addUser(nuevoUsuario);

        return {
            ok: true,
            usuario: nuevoUsuario,
            mensaje: "Usuario registrado correctamente."
        };
    } catch (error) {
        return {
            ok: false,
            mensaje: "No se pudo registrar el usuario."
        };
    }
}

// ======================================================
// CRUD DE OFERTAS
// ======================================================

export async function addOferta(oferta) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_OFERTAS, "readwrite");
        const store = transaction.objectStore(STORE_OFERTAS);
        const request = store.add(oferta);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error("Error al añadir la oferta"));
    });
}

export async function getOfertas() {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_OFERTAS, "readonly");
        const store = transaction.objectStore(STORE_OFERTAS);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error("Error al obtener las ofertas"));
    });
}

export async function deleteOferta(id) {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_OFERTAS, "readwrite");
        const store = transaction.objectStore(STORE_OFERTAS);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error("Error al eliminar la oferta"));
    });
}

export async function getOfertasByUser(email) {
    const ofertas = await getOfertas();
    return ofertas.filter((oferta) => oferta.usuarioEmail === email);
}

// ======================================================
// SESIÓN CON LOCALSTORAGE
// ======================================================

export function setActiveUser(email) {
    localStorage.setItem(ACTIVE_USER_KEY, email);
}

export function getActiveUser() {
    return localStorage.getItem(ACTIVE_USER_KEY);
}

export function logOutUser() {
    localStorage.removeItem(ACTIVE_USER_KEY);
}

export async function loginUser(email, password) {
    const usuario = await getUserByEmail(email);

    if (!usuario) {
        return false;
    }

    if (usuario.password !== password) {
        return false;
    }

    setActiveUser(usuario.email);
    return true;
}

export async function loguearUsuario(email, password) {
    if (!email || !password) {
        return {
            ok: false,
            mensaje: "Debes completar email y contraseña."
        };
    }

    const loginCorrecto = await loginUser(email, password);

    if (!loginCorrecto) {
        return {
            ok: false,
            mensaje: "Email o contraseña incorrectos."
        };
    }

    const usuario = await obtenerUsuarioActivo();

    return {
        ok: true,
        usuario,
        mensaje: `Bienvenido/a, ${usuario.nombre}.`
    };
}

export async function obtenerUsuarioActivo() {
    const email = getActiveUser();

    if (!email) {
        return null;
    }

    return await getUserByEmail(email);
}

export function cerrarSesion() {
    logOutUser();
}

export async function haySesionActiva() {
    const usuario = await obtenerUsuarioActivo();
    return usuario !== null;
}