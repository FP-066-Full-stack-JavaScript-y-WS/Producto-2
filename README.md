# NodeNinjas – Plataforma Empleo

## Introducción

Este proyecto ha sido desarrollado en equipo por **NodeNinjas** como parte del Producto 2 de la asignatura **FP.066 - (P) Desarrollo full stack con JavaScript y servicios web**.

En esta fase del proyecto se ha trabajado con:
- HTML5
- CSS3
- JavaScript básico
- Bootstrap
- IndexedDB
- localStorage

## Carga de datos automática en IndexedDB

La aplicación incluye una carga automática de datos iniciales en IndexedDB para facilitar las pruebas y garantizar que el proyecto tenga contenido desde el primer acceso. Los datos iniciales se cargan automáticamente al entrar en la pantalla de login, cuando se dispara el evento `DOMContentLoaded`.

## Persistencia de datos

En este producto se ha incorporado persistencia en el navegador mediante:

- **localStorage**, para mantener la sesión del usuario activo
- **IndexedDB**, para almacenar usuarios y publicaciones de ofertas/demandas de empleo de forma persistente

Gracias a esto, la aplicación conserva la información aunque se recargue la página o se cierre el navegador.


## Ejecución en CodeSandbox

El proyecto está preparado para ejecutarse directamente en CodeSandbox sin necesidad de descarga ni configuración adicional.

### Pasos

1. Abrir el enlace del repositorio en CodeSandbox
2. Esperar a que se instalen las dependencias automáticamente
3. Abrir la **preview del puerto 8080**

### Importante

- ✅ **Puerto correcto:** 8080 → muestra la aplicación  
- ❌ **Puerto 2222:** Predefinido por CodeSandbox, **debe ignorarse** ya que no se asocia al proyecto.