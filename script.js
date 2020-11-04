//VARIABLES
var apiGiphy = "MtsaH6LjvHkYF7D24Z0URDpWPXaht2to";

// cambio de theme
let ss = sessionStorage.getItem("theme");
let ssTendencias = sessionStorage.getItem('tendencias');

if (ss != null) {
    applyTheme()
}

if (ssTendencias != null) {
    guardarGifs(JSON.parse(ssTendencias))
} else {
    mostrarGifs("Tendencias");
}

document.getElementById("div_busquedas").style.display = "none"



// HANDLERS
document.getElementById("btnBuscar").addEventListener("click", function() {

    let ingreso = document.getElementById("inputBusqueda").value.trim();

    if (ingreso != "") {
        mostrarGifs(ingreso);
    }

});

document.getElementById("inputBusqueda").addEventListener("keyup", function(event) {

    if (event.keyCode == 13) {

        document.getElementById("dropdownBusqueda").style.display = "none";
        let temaactual = document.body.className;
        if (temaactual == "dayTheme") {
            document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa_inactive.svg")
        } else if (temaactual == "nightTheme") {
            document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/Combined Shape.svg")
        }
        let ingreso = this.value.trim();

        if (ingreso != "") {
            mostrarGifs(ingreso);
        }
    }

})

document.getElementById("btnBuscar").onmousedown = () => {
    let temaactual = document.body.className;
    if (temaactual == "dayTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa.svg")
    } else if (temaactual == "nightTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa_light.svg")
    }

}

document.getElementById("btnBuscar").onmouseup = () => {
    let temaactual = document.body.className;
    if (temaactual == "dayTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa_inactive.svg")
    } else if (temaactual == "nightTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/Combined Shape.svg")
    }
}

Array.from(document.getElementsByClassName("btnMasSugeridos")).forEach(btn => {
    btn.addEventListener("click", function() {
        let hashtag = this.previousElementSibling.innerText;
        let palabra = hashtag.substr(1);
        mostrarGifs(palabra);
    })
})

document.getElementById("btnNavbarTheme").addEventListener("click", function() {

    let ul = document.getElementsByClassName("dropdownTheme")[0];

    if (ul.style.display == "") {
        ul.style.display = "block";
        document.getElementsByClassName("divNavbar")[0].style.marginBottom = "90px";
    } else if (ul.style.display == "block") {
        ul.style.display = "";
        document.getElementsByClassName("divNavbar")[0].style.marginBottom = "0px";
    }

})

document.getElementById("inputBusqueda").onfocus = () => {
    document.getElementById("dropdownBusqueda").style.display = "block";
    let temaactual = document.body.className;
    if (temaactual == "dayTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa.svg")
    } else if (temaactual == "nightTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa_light.svg")
    }
    document.getElementById("div_busquedas").style.display = "none"
}

document.getElementById("inputBusqueda").onblur = () => {
    document.getElementById("dropdownBusqueda").style.display = "none";
    let temaactual = document.body.className;
    if (temaactual == "dayTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa_inactive.svg")
    } else if (temaactual == "nightTheme") {
        document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/Combined Shape.svg")
    }
}

Array.from(document.getElementsByClassName("sugBusqueda")).forEach(ddBusqueda => {
    ddBusqueda.addEventListener("mousedown", function() {
        mostrarGifs(this.innerText)
    })
})


document.getElementById("btnMisGuifos").addEventListener("click", function() {

    sessionStorage.setItem('razonVideos', 'misguifos');

})


document.getElementById("btnCrearGuifos").addEventListener("click", function() {

    sessionStorage.setItem('razonVideos', 'crear');

})

// CAMBIO DE THEME

document.getElementById("dayTheme").onclick = () => {

    sessionStorage.setItem('theme', 'dayTheme')
    applyTheme();
}

document.getElementById("nightTheme").onclick = () => {

    sessionStorage.setItem('theme', 'nightTheme')
    applyTheme();

}



// FUNCIONES 

async function buscarGif(keyword) {

    let cantGif = 28;
    let urlGiphy = "";
    (keyword == "Tendencias") ? urlGiphy = 'https://api.giphy.com/v1/gifs/trending' + '?api_key=' + apiGiphy + '&limit=' + cantGif: urlGiphy = 'https://api.giphy.com/v1/gifs/search?q=' + keyword + '&api_key=' + apiGiphy + '&limit=' + cantGif;

    let gifs = await fetch(urlGiphy);
    return gifs.json();
}


function guardarGifs(arrayGifs) {
    let indexRow = 0;

    mostrarBusquedas();

    for (g of arrayGifs.data) {

        //div
        let divimg = document.createElement("div");
        let src = g.images.original.url;
        let h = parseFloat(g.images.original.height);
        let w = parseFloat(g.images.original.width);

        if (indexRow == 3) {
            divimg.className = "gifCuadrado";
            indexRow = 0;
        } else {
            if (w > (h * 1.5)) {
                divimg.className = "gifRect";
                (indexRow == 2) ? indexRow = 0: indexRow += 2;
            } else {
                divimg.className = "gifCuadrado";
                indexRow++;
            }
        }

        divimg.classList.add("gifResultado");
        divimg.classList.add(document.body.className);
        divimg.style.backgroundImage = "url('" + src + "')";

        //parrafo
        let parrafo = document.createElement("p");
        let titles = g.title;
        let hashtags = "#" + titles.substr(0, titles.indexOf(" GIF")).replace(/\s/g, " #");

        parrafo.innerText = hashtags;
        parrafo.classList.add("gifHashtagRta");
        parrafo.classList.add(document.body.className);
        divimg.appendChild(parrafo);

        document.getElementById("resultadoBusqueda").appendChild(divimg);
    }

}

// Llamar a esta función para buscar y mostrar los gifs
function mostrarGifs(busqueda) {

    if (busqueda != "Tendencias") {
        document.getElementById("section_sugeridos").style.display = "none";
    } else {
        document.getElementById("section_sugeridos").style.display = "block";
    }

    buscarGif(busqueda).then((rta) => {
        console.log(rta);
        document.getElementById("resultadoBusqueda").innerHTML = "";
        document.getElementById("parrafoBusqueda").innerText = busqueda;

        if (busqueda == "Tendencias") {
            sessionStorage.setItem('tendencias', JSON.stringify(rta));
        } else {
            let ssBusquedas = sessionStorage.getItem("busquedas");
            if (ssBusquedas != null) {
                sessionStorage.setItem("busquedas", busqueda + "|" + ssBusquedas)
            } else {
                sessionStorage.setItem("busquedas", busqueda);
            }
        }

        guardarGifs(rta);
    }).catch((err) => {
        return err;
    })
}

function applyTheme() {
    let theme = sessionStorage.getItem('theme');

    if (theme == "dayTheme") {

        Array.from(document.getElementsByClassName("nightTheme")).forEach(e => {
            e.classList.add("dayTheme");
            e.classList.remove("nightTheme");
            document.getElementById("logo").setAttribute("src", "assets/gifOF_logo.png");
            document.getElementsByClassName("dropdown")[0].children[0].setAttribute("src", "assets/dropdown.svg");
            document.getElementById("dayTheme").innerHTML = "<u>S</u>ailor Day";
            document.getElementById("nightTheme").innerHTML = "Sailor Night";
            document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/lupa_inactive.svg")
        })

    } else if (theme == "nightTheme") {

        Array.from(document.getElementsByClassName("dayTheme")).forEach(e => {
            e.classList.add("nightTheme");
            e.classList.remove("dayTheme");
            document.getElementById("logo").setAttribute("src", "assets/gifOF_logo_dark.png");
            document.getElementsByClassName("dropdown")[0].children[0].setAttribute("src", "assets/dropdownDT.svg");
            document.getElementById("nightTheme").innerHTML = "<u>S</u>ailor Night";
            document.getElementById("dayTheme").innerHTML = "Sailor Day";
            document.getElementById("btnBuscar").children[0].setAttribute("src", "assets/Combined Shape.svg")
        })

    }
}

function mostrarBusquedas() {

    let sstBusqueda = sessionStorage.getItem("busquedas");
    document.getElementById("div_busquedas").innerHTML = ""

    if (sstBusqueda != null) {

        let arrayBusquedas = sstBusqueda.split("|");

        for (b of arrayBusquedas) {

            let btn = document.createElement("button");
            btn.innerText = "#" + b;
            btn.classList.add("btnBusquedasSS");
            btn.classList.add(document.body.className);

            document.getElementById("div_busquedas").appendChild(btn)

        }

        document.getElementById("div_busquedas").style.display = "block"

    }

}