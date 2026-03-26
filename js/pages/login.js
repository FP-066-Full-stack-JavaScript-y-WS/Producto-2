import { loginUser, getUsers } from "../modules/almacenaje.js";

const formulario = document.getElementById("loginForm");
const contenedorMensaje = document.getElementById("loginMensaje");

formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const loginCorrecto = await loginUser(email, password);

        if (!loginCorrecto) {
            mostrarMensaje("Credenciales incorrectas. Inténtalo de nuevo.", "danger");
            return;
        }
        mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...", "success");
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

/* Prompts IA. IA Usada: ChatGPT

- Después de intentar iniciar sesión, quiero mostrar un mensaje en pantalla indicando si ha ido bien o mal, usando estilos de Bootstrap. ¿Cómo puedo hacerlo?
- Quiero mostrar en la página una lista de usuarios de prueba a partir de un array, usando una plantilla HTML para no repetir código.
- Necesito que el usuario sea redirigido al dashboard después de iniciar sesión correctamente, pero quiero darle un pequeño tiempo para que vea el mensaje de éxito antes de cambiar de página. ¿Cómo puedo hacerlo?
- Quiero validar el formulario de login para asegurarme de que el email tiene un formato correcto y que la contraseña no está vacía antes de intentar iniciar sesión. ¿Cómo puedo hacerlo?

*/