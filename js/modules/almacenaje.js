const DB_NAME = "empleoDB";
const DB_VERSION = 1;
const STORE_USUARIOS = "usuarios";
const STORE_OFERTAS = "ofertas";

export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION); //Abre la base de datos y si no existe la crea

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_USUARIOS)) {
                db.createObjectStore(STORE_USUARIOS, {keyPath: "email"}); //Esto es como si fuera la PK de la tabla en una base de datos
            }
            if (!db.objectStoreNames.contains(STORE_OFERTAS)) {
                db.createObjectStore(STORE_OFERTAS, {keyPath: "id", autoIncrement: true}); //Lo mismo pero con el campo autoincementable
            }
        };

        request.onsuccess =() => {
            resolve(request.result);
        }

        request.onerror = () => {
            reject(new Error("Error al abrir la base de datos"));
        }
    });
}

//Funciones CRUD. WIP
export async function addUser(usuario) {}

export async function getUsers(email) {}

export async function deleteUser(email) {}

export async function getUserByEmail(email) {}