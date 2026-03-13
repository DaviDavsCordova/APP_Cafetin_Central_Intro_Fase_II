// Arreglo de las cuentas del cafetín
var cuentas = [
    { usuario: "ClienteUCV", clave: "Central_123", rol: "Clientela" },
    { usuario: "caja_01", clave: "Cajero#123", rol: "Personal de Caja" },
    { usuario: "adminRoot", clave: "cafetinAdmin", rol: "Administración" }
];

// Los datos de la comida simulada
var productos = [
    { id: 1, nombre: "Empanada", precio: 25 },
    { id: 2, nombre: "Cachito", precio: 30},
    { id: 3, nombre: "Cachapa", precio: 20 },
    { id: 4, nombre: "Jugo", precio: 20 },
    { id: 5, nombre: "Café", precio: 15 },
    { id: 6, nombre: "Malta", precio: 40 },
    { id: 7, nombre: "Tizana", precio: 15 }
    
];

// Variables para guardar datos de las pantallas
var carrito = [];
var caja = [];
var historial = [];
var losPuntos = 150;
var usoPuntos = false;

// Función para el botón de entrar
document.getElementById('btn-entrar').onclick = function() {
    var u = document.getElementById('usu').value;
    var c = document.getElementById('cla').value;
    var cuentaActiva = null;

    // Buscando el usuario en el arreglo
    for(var i=0; i < cuentas.length; i++) {
        if(cuentas[i].usuario == u && cuentas[i].clave == c) {
            cuentaActiva = cuentas[i];
            break;
        }
    }

    if(cuentaActiva) {
        document.getElementById('pantalla-login').style.display = 'none';
        document.getElementById('info-usuario').style.display = 'block';
        document.getElementById('nombre-usu').innerText = cuentaActiva.usuario;
        document.getElementById('rol-usu').innerText = cuentaActiva.rol;

        if(cuentaActiva.rol == "Clientela") {
            document.getElementById('pantalla-cliente').style.display = 'block';
            verCatalogo();
        } else if(cuentaActiva.rol == "Personal de Caja") {
            document.getElementById('pantalla-caja').style.display = 'block';
            verMenuCaja();
        } else if(cuentaActiva.rol == "Administración") {
            document.getElementById('pantalla-admin').style.display = 'block';
            verTabla();
        }
    } else {
        alert("Usuario o clave incorrectos. Revisa bien.");
    }
};


function seleccionarUsuario(usuario, evento) {
    if (evento) {
        evento.preventDefault();
    }
    document.getElementById('usu').value = usuario;
    document.getElementById('cla').focus();
}

function salir() {
    location.reload(); // Es más seguro recargar para limpiar todo el estado
}


function toggleClave() {
    var campoClave = document.getElementById('cla');
    if(campoClave.type == 'password') {
        campoClave.type = 'text';
    } else {
        campoClave.type = 'password';
    }
}

// ================== MÓDULO CLIENTE ==================

function cambiarVista(pantalla) {
    document.getElementById('div-catalogo').style.display = 'none';
    document.getElementById('div-carrito').style.display = 'none';
    document.getElementById('div-historial').style.display = 'none';

    document.getElementById(pantalla).style.display = 'block';

    if(pantalla == 'div-carrito') {
        pintarCarrito();
    }
}

function verCatalogo() {
    var lista = document.getElementById('lista-prod');
    lista.innerHTML = "";

    for(var i=0; i < productos.length; i++) {
        var p = productos[i];
        var card = "<div class='producto-card'>";
        card += "<h3>" + p.nombre + "</h3>";
        card += "<p>Precio: " + p.precio + " Bs.</p>";
        card += "<button onclick='meter(" + p.id + ")'>Añadir al Carrito</button>";
        card += "</div>";
        lista.innerHTML += card;
    }
}

function meter(id) {
    var p = productos.find(prod => prod.id == id);
    if(p) {
        carrito.push(p);
        alert("Añadido: " + p.nombre);
        document.getElementById('cant-carrito').innerText = carrito.length;
    }
}

function pintarCarrito() {
    var listaHtml = document.getElementById('items-carrito');
    listaHtml.innerHTML = "";
    var total = 0;

    for(var i=0; i < carrito.length; i++) {
        listaHtml.innerHTML += "<li>" + carrito[i].nombre + " - " + carrito[i].precio + " Bs.</li>";
        total += carrito[i].precio;
    }

    if(usoPuntos) {
        total -= 15;
    }

    document.getElementById('total-pagar').innerText = total;

    // El botón de puntos aparece si tienes suficientes y no lo has usado en esta compra
    var btnPuntos = document.getElementById('btn-puntos');
    if(carrito.length > 0 && !usoPuntos && losPuntos >= 150) {
        btnPuntos.style.display = 'inline-block';
    } else {
        btnPuntos.style.display = 'none';
    }
}

function gastarPuntos() {
    var t = parseFloat(document.getElementById('total-pagar').innerText);
    if(t >= 15) {
        usoPuntos = true;
        alert("¡Puntos aplicados! Descuento de 15 Bs.");
        pintarCarrito();
    } else {
        alert("La compra debe ser mayor a 15 Bs. para usar los puntos.");
    }
}

function pagar() {
    if(carrito.length == 0) {
        alert("El carrito está vacío.");
        return;
    }

    var elTotal = document.getElementById('total-pagar').innerText;
    var txt = "Compra: " + carrito.length + " productos. Pago total: " + elTotal + " Bs.";

    if(usoPuntos) {
        txt += " (Usaste puntos de lealtad)";
        losPuntos -= 150;
        document.getElementById('mis-puntos').innerText = losPuntos;
    }

    historial.push(txt);
    carrito = [];
    usoPuntos = false;
    document.getElementById('cant-carrito').innerText = "0";

    alert("¡Pago exitoso! Gracias por su compra.");

    // Actualizar lista de historial
    var ulHist = document.getElementById('lista-hist');
    ulHist.innerHTML = historial.map(h => "<li>" + h + "</li>").join('');

    cambiarVista('div-historial');
}

// ================== MÓDULO CAJERO ==================

function verMenuCaja() {
    var div = document.getElementById('lista-caja');
    div.innerHTML = "";
    for(var i=0; i<productos.length; i++) {
        var boton = "<button class='boton-caja' onclick='cobrar(" + productos[i].id + ")'>" +
                    productos[i].nombre + " (" + productos[i].precio + ")</button>";
        div.innerHTML += boton;
    }
}

function cobrar(id) {
    var p = productos.find(prod => prod.id == id);
    if(p) {
        caja.push(p);
        var totalC = 0;
        var lista = document.getElementById('items-caja');
        lista.innerHTML = "";

        for(var j=0; j<caja.length; j++) {
            lista.innerHTML += "<li>" + caja[j].nombre + "</li>";
            totalC += caja[j].precio;
        }
        document.getElementById('total-caja').innerText = totalC;
    }
}

function darRecibo() {
    if(caja.length > 0) {
        alert("¡Recibo emitido con éxito!");
        caja = [];
        document.getElementById('items-caja').innerHTML = "";
        document.getElementById('total-caja').innerText = "0";
    } else {
        alert("No hay productos marcados.");
    }
}

// ================== MÓDULO ADMIN ==================

function verTabla() {
    var tab = document.getElementById('cuerpo-tabla');
    tab.innerHTML = "";
    for(var i=0; i<productos.length; i++) {
        var f = "<tr>";
        f += "<td>" + productos[i].nombre + "</td>";
        f += "<td>" + productos[i].precio + " Bs.</td>";
        f += "<td><button class='btn-eliminar' onclick='quitar(" + productos[i].id + ")'>Eliminar</button></td>";
        f += "</tr>";
        tab.innerHTML += f;
    }
}

function agregarProd() {
    var n = document.getElementById('n-nombre').value;
    var p = parseFloat(document.getElementById('n-precio').value);

    if(n == "" || isNaN(p)) {
        alert("Error: Nombre o precio inválido.");
        return;
    }

    var idNuevo = productos.length > 0 ? productos[productos.length-1].id + 1 : 1;
    productos.push({ id: idNuevo, nombre: n, precio: p });

    document.getElementById('n-nombre').value = "";
    document.getElementById('n-precio').value = "";

    alert("Producto guardado.");
    verTabla();
}

function quitar(id) {
    productos = productos.filter(p => p.id != id);
    verTabla();
}

// Exponer funciones al objeto window para navegadores modernos
window.salir = salir;
window.cambiarVista = cambiarVista;
window.meter = meter;
window.gastarPuntos = gastarPuntos;
window.pagar = pagar;
window.cobrar = cobrar;
window.darRecibo = darRecibo;
window.agregarProd = agregarProd;
window.quitar = quitar;
window.seleccionarUsuario = seleccionarUsuario;

window.toggleClave = toggleClave;
