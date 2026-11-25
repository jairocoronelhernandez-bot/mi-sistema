const usuarios = {
    "JAIRO": "CORONEL",
    "MAGALY": "CAMPOS"
};

function iniciarSesion() {  // Crea una función llamada iniciarSesion. Se ejecutará cuando el usuario pulse el botón INGRESAR.
       
    const usuario = document.getElementById("usuario").value.trim().toUpperCase(); // Obtiene el texto escrito en el campo con id "usuario"..value = obtiene el contenido..trim() = elimina espacios al inicio y final..toUpperCase() = convierte el texto a mayúsculas.
    const password = document.getElementById("password").value.trim().toUpperCase(); // hace lo mismo pero con el password

    const mensaje = document.getElementById("mensaje"); //Guarda una referencia al elemento HTML donde mostrarás los mensajes de error.

    if (usuarios[usuario] && usuarios[usuario] === password) { //tiene que ver con la contraseña

        document.getElementById("login").style.display = "none"; //Oculta el formulario de inicio de sesión (el contenedor con id "login").

        document.getElementById("sistema").style.display = "block"; //Muestra el sistema principal (el contenedor con id "sistema").

        document.getElementById("usuarioActivo").textContent = usuario; //Coloca el nombre del usuario que inició sesión dentro del elemento con id "usuarioActivo".

        mensaje.textContent = ""; //Limpia el mensaje de error.

    } else {

        mensaje.textContent = "Usuario o contraseña incorrectos";
        mensaje.style.color = "red";

    }
}

function cerrarSesion() {

    document.getElementById("sistema").style.display = "none"; //Oculta el sistema principal.

    document.getElementById("login").style.display = "flex"; //Muestra nuevamente la pantalla de login.

    document.getElementById("usuario").value = ""; //Borra el nombre de usuario.
    document.getElementById("password").value = ""; //Borra la contraseña.
    document.getElementById("mensaje").textContent = ""; //Elimina cualquier mensaje de error o aviso.
    document.getElementById("usuario").focus(); //el cursor se coloque automáticamente en el cuadro de usuario
}


// NAVEGACIÓN CON FLECHAS DEL TECLADO EN TABLA 
 
document.addEventListener("keydown", function(event) {

    // No interferir con la navegación dentro de la tabla
    if (event.target.closest("#tabla-base")) return;

    const usuario = document.getElementById("usuario");
    const password = document.getElementById("password");
    const boton = document.querySelector("#login button");

    const elementos = [usuario, password, boton];

    let actual = elementos.indexOf(document.activeElement);

    if (event.key === "ArrowDown") {
        event.preventDefault();

        if (actual < 0) actual = 0;
        else actual = (actual + 1) % elementos.length;

        elementos[actual].focus();
    }

    if (event.key === "ArrowUp") {
        event.preventDefault();

        if (actual < 0) actual = 0;
        else actual = (actual - 1 + elementos.length) % elementos.length;

        elementos[actual].focus();
    }

});




 // NAVEGACIÓN CON LAS CUATRO FLECHAS EN LA TABLA
document.addEventListener("keydown", function(event) {

    const tabla = document.getElementById("tabla-base");

    if (!tabla) return;

    const celdaActual = event.target.closest("#tabla-base tbody td");

    if (!celdaActual) return;

    const filaActual = celdaActual.parentElement;
    const tbody = filaActual.parentElement;

    let filaDestino = filaActual.rowIndex - 1;
    let columnaDestino = celdaActual.cellIndex;

    // Comprobar si el cursor está al inicio o final del texto
    function estaEnBorde(elemento, lado) {

        const seleccion = window.getSelection();

        if (!seleccion || !seleccion.rangeCount) return true;

        const rango = seleccion.getRangeAt(0);

        if (!rango.collapsed) return false;

        const anterior = rango.cloneRange();
        anterior.selectNodeContents(elemento);
        anterior.setEnd(rango.startContainer, rango.startOffset);

        const posicion = anterior.toString().length;
        const total = elemento.textContent.length;

        return lado === "izquierda"
            ? posicion === 0
            : posicion === total;
    }

    // Flecha izquierda
    if (event.key === "ArrowLeft") {

        if (celdaActual.isContentEditable &&
            !estaEnBorde(celdaActual, "izquierda")) return;

        columnaDestino--;
    }

    // Flecha derecha
    else if (event.key === "ArrowRight") {

        if (celdaActual.isContentEditable &&
            !estaEnBorde(celdaActual, "derecha")) return;

        columnaDestino++;
    }

    // Flecha arriba
    else if (event.key === "ArrowUp") {
        filaDestino--;
    }

    // Flecha abajo
    else if (event.key === "ArrowDown") {
        filaDestino++;
    }

    else {
        return;
    }

    event.preventDefault();

    const filas = Array.from(tbody.rows);

    if (filaDestino < 0 || filaDestino >= filas.length) return;

    const filaNueva = filas[filaDestino];

    if (columnaDestino < 0 ||
        columnaDestino >= filaNueva.cells.length) return;

    const nuevaCelda = filaNueva.cells[columnaDestino];

    const control = nuevaCelda.querySelector("input[type='checkbox']");

    if (control) {
        control.focus();
    } else {
        nuevaCelda.focus();

        // Colocar cursor al inicio o final al cambiar horizontalmente
        if (event.key === "ArrowRight" ||
            event.key === "ArrowLeft") {

            const rango = document.createRange();
            const seleccion = window.getSelection();

            rango.selectNodeContents(nuevaCelda);

            rango.collapse(event.key === "ArrowRight");

            seleccion.removeAllRanges();
            seleccion.addRange(rango);
        }
    }

});




// INICIAR SESIÓN CON LA TECLA ENTER
document.addEventListener("keydown", function(event) { //Detecta cada vez que el usuario presiona una tecla.

    if (event.key === "Enter") { //Solo continuará cuando el usuario pulse Enter.

        // Solo iniciar sesión si estamos en la pantalla de login
        if (document.getElementById("login").style.display !== "none") { //Si el login no está oculto, significa que todavía no ha iniciado sesión.

            event.preventDefault(); //Evita que el navegador realice otra acción asociada a Enter.
            iniciarSesion(); //Llama a tu función de validación de usuario y contraseña.

        }

    }

});



/* INICIAR HISTORIAL DE NAVEGACION */

history.replaceState(
    { vista: "inicio" },
    "",
    "#inicio"
);


/* MOSTRAR PANTALLA SEGUN EL HISTORIAL */

function cargarPantalla(estado) {

    if (!estado) return;

    // OCULTAR TODAS LAS PANTALLAS
    document.getElementById("sistema").style.display = "none";
    document.getElementById("ventana-vacantes").style.display = "none";

    // NAVEGAR A INICIO
    if (estado.vista === "inicio") {

        document.getElementById("sistema").style.display = "block";

        document.querySelectorAll("#sistema .seccion").forEach(s => {
            s.style.display = "none";
        });

        document.getElementById("seccion-inicio").style.display = "block";
    }

    // NAVEGAR A VACANTES
    if (estado.vista === "vacantes") {

        document.getElementById("ventana-vacantes").style.display = "block";

        document.getElementById("vacante-inicio").style.display = "none";

        document.querySelectorAll(".subseccion").forEach(s => {
            s.style.display = "none";
        });

        document.querySelectorAll(".menu-derecho button").forEach(b => {
            b.classList.remove("activo");
        });

        if (estado.numero) {

            document.getElementById("vacante-" + estado.numero).style.display = "block";

            document.querySelectorAll(".menu-derecho button")
                [estado.numero - 1].classList.add("activo");

        } else {

            document.getElementById("vacante-inicio").style.display = "block";
        }
    }
}


/* AGREGAR UNA NUEVA NAVEGACION */

function navegar(estado, hash) {

    history.pushState(
        estado,
        "",
        "#" + hash
    );

    cargarPantalla(estado);
}




/* TIENE QUE VER CON EL CUESTIONARIO DEL CLEAVER */

function mostrarSeccion(numero) {

    document.getElementById("seccion-inicio").style.display = "none";
    document.getElementById("seccion-1").style.display = "none";
    document.getElementById("seccion-2").style.display = "none";
    document.getElementById("seccion-3").style.display = "none";
    document.getElementById("seccion-4").style.display = "none";

    document.getElementById("seccion-" + numero).style.display = "block";
}

function guardarCleaver() {
    alert("Evaluación guardada correctamente");
}






/* BOTON DE RETROCEDSO */

function mostrarInicio() {

    document.getElementById("seccion-inicio").style.display = "block";

    document.getElementById("seccion-1").style.display = "none";
    document.getElementById("seccion-2").style.display = "none";
    document.getElementById("seccion-3").style.display = "none";
    document.getElementById("seccion-4").style.display = "none";
}









// ========================================
// BASE DE RECLUTAMIENTO AUTOMATICA
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const tabla = document.getElementById("tabla-base");

    if (!tabla) return;

    const tbody = tabla.querySelector("tbody");

    const CLAVE = "base_reclutamiento_psicotesti";

    // Plantilla de fila
    const plantilla = tbody.rows[0].cloneNode(true);

    // Limpiar fila
    function limpiarFila(fila) {

        Array.from(fila.cells).forEach(celda => {

            const checkbox = celda.querySelector(
                'input[type="checkbox"]'
            );

            if (checkbox) {
                checkbox.checked = false;
            } else {
                celda.textContent = "";
            }

        });

    }

    // Crear fila nueva
    function crearFila() {

        const fila = plantilla.cloneNode(true);

        limpiarFila(fila);

        tbody.appendChild(fila);

        return fila;
    }

    // Revisar si la fila tiene información
    function tieneDatos(fila) {

        return Array.from(fila.cells).some(celda => {

            const checkbox = celda.querySelector(
                'input[type="checkbox"]'
            );

            if (checkbox) {
                return checkbox.checked;
            }

            return celda.textContent.trim() !== "";

        });

    }

    // Agregar una fila vacía cuando se use la última
    function revisarFilas() {

        const filas = Array.from(tbody.rows);

      
function revisarFilas() {

    // Si no existe ninguna fila, conservar una primera fila
         if (tbody.rows.length === 0) {
        crearFila();
         }

         }


        const ultimaFila = filas[filas.length - 1];

        if (tieneDatos(ultimaFila)) {
            crearFila();
        }

    }





    // Guardar información
    function guardarBase() {

        const datos = Array.from(tbody.rows).map(fila => {

            return Array.from(fila.cells).map(celda => {

                const checkbox = celda.querySelector(
                    'input[type="checkbox"]'
                );

                if (checkbox) {
                    return {
                        tipo: "checkbox",
                        valor: checkbox.checked
                    };
                }

                return {
                    tipo: "texto",
                    valor: celda.textContent
                };

            });

        });

        localStorage.setItem(CLAVE, JSON.stringify(datos));

    }

    // Recuperar información
    function cargarBase() {

        const guardado = localStorage.getItem(CLAVE);

        if (!guardado) return;

        try {

            const datos = JSON.parse(guardado);

            tbody.innerHTML = "";

            datos.forEach(datosFila => {

                const fila = plantilla.cloneNode(true);

                datosFila.forEach((dato, indice) => {

                    const celda = fila.cells[indice];

                    if (!celda) return;

                    const checkbox = celda.querySelector(
                        'input[type="checkbox"]'
                    );

                    if (checkbox) {
                        checkbox.checked = dato.valor === true;
                    } else {
                        celda.textContent = dato.valor ?? "";
                    }

                });

                tbody.appendChild(fila);

            });

        } catch (error) {

            console.error("Error al cargar la base:", error);

        }

    }

    // Detectar escritura
    tbody.addEventListener("input", function () {

        revisarFilas();
        guardarBase();

    });

    // Detectar casillas
    tbody.addEventListener("change", function () {

        revisarFilas();
        guardarBase();

    });


            
// AGREGAR FILA AL PRESIONAR ENTER

// ELIMINAR FILAS VACÍAS, EXCEPTO LA PRIMERA
tbody.addEventListener("focusout", function(event) {

    const fila = event.target.closest("tr");

    if (!fila) return;

    // Nunca eliminar la primera fila
    if (fila === tbody.rows[0]) return;

    // Si la fila no tiene datos ni casillas marcadas, eliminarla
    if (!tieneDatos(fila)) {

        fila.remove();

        guardarBase();
    }

});








    // Iniciar
    cargarBase();

    revisarFilas();

    guardarBase();

});











// ==========================================
// CAMBIO DE COLOR AL MARCAR LAS CASILLAS
// ==========================================

function cambiarColorFila(fila) {

    if (!fila) return;

    // Quitar colores anteriores
    fila.classList.remove(
        "fila-pagado",
        "fila-presentado",
        "fila-no-presentado",
        "fila-contratado",
        "fila-reagenda"
    );

    const casillas = fila.querySelectorAll(
        'input[type="checkbox"]'
    );

    // Verificar las cinco casillas
    const pagado = casillas[0]?.checked;
    const presentado = casillas[1]?.checked;
    const noPresentado = casillas[2]?.checked;
    const contratado = casillas[3]?.checked;
    const reagenda = casillas[4]?.checked;

    // Aplicar color según el estado
    if (contratado) {
        fila.classList.add("fila-contratado");
    }
    else if (noPresentado) {
        fila.classList.add("fila-no-presentado");
    }
    else if (reagenda) {
        fila.classList.add("fila-reagenda");
    }
    else if (presentado) {
        fila.classList.add("fila-presentado");
    }
    else if (pagado) {
        fila.classList.add("fila-pagado");
    }
}

// Detectar clics en las casillas de la tabla
document.addEventListener("change", function(evento) {

    if (evento.target.matches(
        "#tabla-base tbody input[type='checkbox']"
    )) {

        const fila = evento.target.closest("tr");

        cambiarColorFila(fila);

    }

});

// Recuperar colores de las filas existentes
document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll("#tabla-base tbody tr")
        .forEach(fila => cambiarColorFila(fila));

});



function cambiarColorFila(casilla) {

    const fila = casilla.closest("tr");

    // Obtener las cinco casillas de esta fila
    const casillas = fila.querySelectorAll(
        'input[type="checkbox"]'
    );

    // Si se seleccionó una casilla, desmarcar las demás
    if (casilla.checked) {

        casillas.forEach(otraCasilla => {

            if (otraCasilla !== casilla) {
                otraCasilla.checked = false;
            }

        });

    }

    // Determinar el color
    let color = "";
    let texto = "black";

    if (casillas[3].checked) {
        color = "#39FF14"; // CONTRATADO
    }
    else if (casillas[2].checked) {
        color = "#FF0000"; // NO SE PRESENTÓ
        texto = "white";
    }
    else if (casillas[4].checked) {
        color = "#FF8000"; // REAGENDA
    }
    else if (casillas[1].checked) {
        color = "#FFFF00"; // SI SE PRESENTÓ
    }
    else if (casillas[0].checked) {
        color = "#39FF14"; // PAGADO
    }

    // Pintar toda la fila
    fila.querySelectorAll("td").forEach(celda => {

        celda.style.setProperty(
            "background-color",
            color || "white",
            "important"
        );

        celda.style.setProperty(
            "color",
            texto,
            "important"
        );

    });

}

// ______






// BORRAR CONTENIDO DE CELDAS CON LA TECLA SUPRIMIR
document.addEventListener("keydown", function(event) {

    if (event.key !== "Delete") return;

    const celda = event.target.closest(
        '#tabla-base td[contenteditable="true"]'
    );

    // Solo actuar si estamos dentro de una celda editable
    if (!celda) return;

    event.preventDefault();

    // Borrar el contenido de la celda
    celda.textContent = "";

    // Guardar los cambios
    celda.dispatchEvent(new Event("input", {
        bubbles: true
    }));

});



// SELECCIONAR CELDAS Y FILAS COMO EN EXCEL
document.addEventListener("DOMContentLoaded", function () {

    const tabla = document.getElementById("tabla-base");
    if (!tabla) return;

    let seleccionando = false;
    let inicio = null;

    function obtenerCelda(elemento) {
        return elemento.closest(
            '#tabla-base td[contenteditable="true"]'
        );
    }

    function limpiarSeleccion() {
        tabla.querySelectorAll(".celda-seleccionada")
            .forEach(celda => {
                celda.classList.remove("celda-seleccionada");
            });
    }

    function seleccionarRango(celdaFinal) {
        if (!inicio || !celdaFinal) return;

        limpiarSeleccion();

        const filaInicio = inicio.parentElement.rowIndex;
        const colInicio = inicio.cellIndex;

        const filaFinal = celdaFinal.parentElement.rowIndex;
        const colFinal = celdaFinal.cellIndex;

        const minFila = Math.min(filaInicio, filaFinal);
        const maxFila = Math.max(filaInicio, filaFinal);
        const minCol = Math.min(colInicio, colFinal);
        const maxCol = Math.max(colInicio, colFinal);

        Array.from(tabla.rows).forEach((fila, indiceFila) => {
            if (indiceFila < minFila || indiceFila > maxFila) return;

            Array.from(fila.cells).forEach((celda, indiceCol) => {
                if (
                    indiceCol >= minCol &&
                    indiceCol <= maxCol &&
                    celda.isContentEditable
                ) {
                    celda.classList.add("celda-seleccionada");
                }
            });
        });
    }

    tabla.addEventListener("mousedown", function(event) {
        const celda = obtenerCelda(event.target);
        if (!celda) return;

        seleccionando = true;
        inicio = celda;
        seleccionarRango(celda);
    });

    tabla.addEventListener("mouseover", function(event) {
        if (!seleccionando) return;

        const celda = obtenerCelda(event.target);
        if (celda) seleccionarRango(celda);
    });

    document.addEventListener("mouseup", function() {
        seleccionando = false;
    });

    // SELECCIONAR FILA COMPLETA CON CLIC DERECHO
    tabla.addEventListener("contextmenu", function(event) {
        const fila = event.target.closest("#tabla-base tbody tr");
        if (!fila) return;

        event.preventDefault();
        limpiarSeleccion();

        Array.from(fila.cells).forEach(celda => {
            if (celda.isContentEditable) {
                celda.classList.add("celda-seleccionada");
            }
        });

        inicio = null;
    });

    // BORRAR CELDAS SELECCIONADAS CON SUPRIMIR
    document.addEventListener("keydown", function(event) {
        if (event.key !== "Delete") return;

        if (!tabla.querySelector(".celda-seleccionada")) return;

        event.preventDefault();

        tabla.querySelectorAll(".celda-seleccionada")
            .forEach(celda => {
                celda.textContent = "";
                celda.classList.remove("celda-seleccionada");
            });

        tabla.querySelector("tbody").dispatchEvent(
            new Event("input", { bubbles: true })
        );
    });

});



function mostrarSeccion(numero) {

    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });

    document.getElementById('seccion-' + numero).style.display = 'block';

    if (numero === 2) {
        document.getElementById('tabla-clientes').innerHTML =
            document.getElementById('tabla-base').innerHTML;
    }
}



function guardarNombre() {

    // Obtener el contenido del input
    let nombre = document.getElementById("nombre").value;

    // Validar que no esté vacío
    if (nombre.trim() === "") {
        alert("ESCRIBE UN NOMBRE");
        return;
    }

    // Obtener el cuerpo de la tabla
    let tabla = document.getElementById("contenidoTabla");

    // Crear una nueva fila
    let fila = tabla.insertRow();

    // Crear una nueva celda
    let celda = fila.insertCell(0);

    // Colocar el nombre en la celda
    celda.textContent = nombre;

    // Limpiar el input
    document.getElementById("nombre").value = "";

}