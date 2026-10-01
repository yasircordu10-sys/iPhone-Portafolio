const btnPedir = document.getElementById('btnPedir');
const btnPlantarse = document.getElementById('btnPlantarse');
const btnReiniciar = document.getElementById('btnReiniciar');
const manoJugadorEl = document.getElementById('manoJugador');
const manoDealerEl = document.getElementById('manoDealer');
const mensajeFinalEl = document.querySelector('.mensaje-final');

const cartasMazo = Array.from(document.querySelectorAll('.mazo .carta:not(.back)'));
const cartaReversoOriginal = document.querySelector('.mazo .carta.back');

let indicesDisponibles = [];
let valoresJugador = [];
let valoresDealer = [];
let elementosDealer = [];
let juegoTerminado = false;

function obtenerValorCarta(valor) {
    if (valor === 'A') {
        return 11;
    } else if (['J', 'Q', 'K'].includes(valor)) {
        return 10;
    } else {
        return parseInt(valor);
    }
}

function calcularPuntaje(valores) {
    let puntaje = 0;
    let ases = 0;

    valores.forEach(function(valor) {
        puntaje += obtenerValorCarta(valor);
        if (valor === 'A') {
            ases++;
        }
    });

    while (puntaje > 21 && ases > 0) {
        puntaje -= 10;
        ases--;
    }

    return puntaje;
}

function barajar() {
    indicesDisponibles = cartasMazo.map(function(_, indice) {
        return indice;
    });

    for (let i = indicesDisponibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = indicesDisponibles[i];
        indicesDisponibles[i] = indicesDisponibles[j];
        indicesDisponibles[j] = temp;
    }
}

function sacarCartaDelMazo() {
    const indice = indicesDisponibles.pop();
    return cartasMazo[indice];
}

function repartirCartaJugador() {
    const cartaOriginal = sacarCartaDelMazo();
    const valor = cartaOriginal.querySelector('.valor').textContent;
    valoresJugador.push(valor);

    const clon = cartaOriginal.cloneNode(true);
    manoJugadorEl.appendChild(clon);
}

function repartirCartaDealer(tapada) {
    const cartaOriginal = sacarCartaDelMazo();
    const valor = cartaOriginal.querySelector('.valor').textContent;
    valoresDealer.push(valor);
    elementosDealer.push(cartaOriginal);

    if (tapada) {
        const clonReverso = cartaReversoOriginal.cloneNode(true);
        manoDealerEl.appendChild(clonReverso);
    } else {
        const clon = cartaOriginal.cloneNode(true);
        manoDealerEl.appendChild(clon);
    }
}

function revelarCartaTapadaDealer() {
    const cartaTapadaVisual = manoDealerEl.querySelector('.carta.back');
    if (!cartaTapadaVisual) {
        return;
    }
    const clonReal = elementosDealer[0].cloneNode(true);
    manoDealerEl.replaceChild(clonReal, cartaTapadaVisual);
}

function mostrarMensaje(texto, tipoClase) {
    mensajeFinalEl.textContent = texto;
    mensajeFinalEl.classList.remove('gano', 'perdio', 'empate');
    mensajeFinalEl.classList.add(tipoClase);
}

function terminarJuego(texto, tipoClase) {
    juegoTerminado = true;
    revelarCartaTapadaDealer();
    mostrarMensaje(texto, tipoClase);
}

function verificarEstadoJugador() {
    const puntajeJugador = calcularPuntaje(valoresJugador);

    if (puntajeJugador > 21) {
        terminarJuego('Te pasaste de 21. ¡Perdiste!', 'perdio');
    } else if (puntajeJugador === 21) {
        terminarJuego('¡Blackjack! ¡Ganaste!', 'gano');
    }
}

function turnoDelDealer() {
    let puntajeDealer = calcularPuntaje(valoresDealer);

    while (puntajeDealer < 17) {
        repartirCartaDealer(false);
        puntajeDealer = calcularPuntaje(valoresDealer);
    }

    const puntajeJugador = calcularPuntaje(valoresJugador);

    if (puntajeDealer > 21) {
        terminarJuego('¡El dealer se pasó! Ganaste', 'gano');
    } else if (puntajeDealer > puntajeJugador) {
        terminarJuego('El dealer gana con ' + puntajeDealer, 'perdio');
    } else if (puntajeDealer < puntajeJugador) {
        terminarJuego('¡Ganaste! ' + puntajeJugador + ' contra ' + puntajeDealer, 'gano');
    } else {
        terminarJuego('Empate', 'empate');
    }
}

function iniciarPartida() {
    manoJugadorEl.innerHTML = '';
    manoDealerEl.innerHTML = '';
    mensajeFinalEl.textContent = '';
    mensajeFinalEl.classList.remove('gano', 'perdio', 'empate');

    valoresJugador = [];
    valoresDealer = [];
    elementosDealer = [];
    juegoTerminado = false;

    barajar();

    repartirCartaJugador();
    repartirCartaDealer(true);
    repartirCartaJugador();
    repartirCartaDealer(false);

    verificarEstadoJugador();
}

btnPedir.addEventListener('click', function() {
    if (juegoTerminado) {
        return;
    }
    repartirCartaJugador();
    verificarEstadoJugador();
});

btnPlantarse.addEventListener('click', function() {
    if (juegoTerminado) {
        return;
    }
    turnoDelDealer();
});

btnReiniciar.addEventListener('click', iniciarPartida);

iniciarPartida();
