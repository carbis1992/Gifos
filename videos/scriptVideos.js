// VARIABLES 

const apiKey = "MtsaH6LjvHkYF7D24Z0URDpWPXaht2to";
const closebtntitulo = '<img class="btnCloseSugeridos" src="../assets/close.svg" alt="close button">';
const openCameraBtn = document.getElementById("videos_btnComenzar");
var blob;
var cameraStream;
var recorder;



// HANDLERS

window.onload = () => {
    let rzn = sessionStorage.getItem('razonVideos');

    if (rzn == "misguifos") {
        document.getElementById("videos_divInicio").style.display = "none"
    }

    applyTheme();
    getMisGuifos()

}

// boton comenzar a subir video

openCameraBtn.addEventListener("click", startCamera);

document.getElementById("videos_btnComenzar").addEventListener("click", function() {

    document.getElementsByClassName("videos_divInicio")[0].style.display = "none";
    document.getElementById("videos_divChequeo").style.display = "block";
    document.getElementById("videos_tituloContenedorVideo").innerHTML = "Un Chequeo Antes de Empezar" + closebtntitulo;
    addEventClose();
    //startCamera();

})

// boton capturar gif
document.getElementById("videos_btnCapturar").addEventListener("click", function() {

    document.getElementById("videos_tituloContenedorVideo").innerHTML = "Capturando Tu Guifo" + closebtntitulo;
    let arraydivbotones = document.getElementsByClassName("btnVideos");
    for (i of arraydivbotones) {
        i.style.display = "none"
    }

    addEventClose();
    recordVideo();

})

// boton listo - termino de grabar gif
document.getElementById("videos_btnListo").addEventListener("click", function() {

    document.getElementById("videos_tituloContenedorVideo").innerHTML = "Vista Previa" + closebtntitulo;
    let arraydivbotones = document.getElementsByClassName("btnVideos");
    for (i of arraydivbotones) {
        i.style.display = "none"
    }
    document.getElementById("videos_btnSubir").parentElement.style.display = "block";

    addEventClose();
    stopRecording();

})

// boton repetir captura
document.getElementById("videos_btnRepetir").addEventListener("click", function() {

    document.getElementById("videos_tituloContenedorVideo").innerHTML = "Un Chequeo Antes de Empezar" + closebtntitulo;
    let arraydivbotones = document.getElementsByClassName("btnVideos");
    for (i of arraydivbotones) {
        i.style.display = "none"
    }
    document.getElementById("videos_btnCapturar").parentElement.style.display = "block";

    document.getElementById("videos_contenedorVideos").style.display = "block";
    document.getElementById("videos_imgContenedor").style.display = "none";
    document.getElementById("videos_divContenedor").style.display = "none";

    addEventClose();

})

// boton subir gif a giphy
document.getElementById("videos_btnSubir").addEventListener("click", function() {
    uploadGif(blob)

    document.getElementById("videos_tituloContenedorVideo").innerHTML = "Subiendo Guifo" + closebtntitulo;
    let arraydivbotones = document.getElementsByClassName("btnVideos");
    for (i of arraydivbotones) {
        i.style.display = "none"
    }
    document.getElementById("videos_btnSubirCancelar").parentElement.style.display = "block";

    document.getElementById("videos_contenedorVideos").style.display = "none";
    document.getElementById("videos_imgContenedor").style.display = "none";
    document.getElementById("videos_divContenedor").style.display = "block";

    addEventClose();
})


// boton copiar enlace gif
document.getElementById("videos_btnCopiarUrl").addEventListener("click", function() {
    let urlActual = this.getAttribute('data-url');
    navigator.clipboard.writeText(urlActual).then(() => {
        alert("Copiaste el gif");
    })
})

//boton descargar gif
document.getElementById("videos_btnDescargarGif").addEventListener("click", function() {
    invokeSaveAsDialog(blob, 'gif.gif');
})






// FUNCIONES

function startCamera() {

    navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                height: { max: 480 },
            }
        })
        .then(function(stream) {
            cameraStream = stream;
            document.getElementById("videos_contenedorVideos").srcObject = cameraStream;
            document.getElementById("videos_contenedorVideos").play();
        });
}

function recordVideo() {
    recorder = createGifRecorder(cameraStream);
    recorder.startRecording();
}

function stopRecording() {
    recorder.stopRecording(showRecordedGif);
}

function showRecordedGif() {
    blob = recorder.getBlob();
    document.getElementById("videos_imgContenedor").src = URL.createObjectURL(blob);

    document.getElementById("videos_imgContenedor").style.display = "block";
    document.getElementById("videos_contenedorVideos").style.display = "none";
    document.getElementById("videos_divContenedor").style.display = "none";
    recorder.destroy();
    recorder = null;

}

function uploadGif(blobGif) {
    let form = new FormData();
    form.append('file', blobGif, 'nombreGif.gif');

    fetch('https://upload.giphy.com/v1/gifs?api_key=' + apiKey, {
        method: 'POST',
        body: form,
        mode: 'cors'
    }).then(rta => { return rta.json() }).then(rtajson => {
        searchGifbyId(rtajson.data.id);
    })
}

function searchGifbyId(id) {

    fetch('https://api.giphy.com/v1/gifs/' + id + '?api_key=' + apiKey).then(gifdata => {

        return gifdata.json()

    }).then(rtaGif => {
        let urlGifNuevo = rtaGif.data.images.original.url;
        let localdata = localStorage.getItem('gifs');
        document.getElementById("videos_btnCopiarUrl").setAttribute('data-url', urlGifNuevo)

        if (localdata != null) {
            localStorage.setItem('gifs', urlGifNuevo + "|" + localdata);
        } else {
            localStorage.setItem('gifs', urlGifNuevo)
        }

        showSuccessfulGif(urlGifNuevo);
    })

}

function showSuccessfulGif(urlGif) {

    document.getElementById("videos_divChequeo").style.display = "none";
    document.getElementById("videos_divSubido").style.display = "block";

    document.getElementById("videos_imgNuevoGif").setAttribute("src", urlGif);

    getMisGuifos()

}

function createGifRecorder(stream) {
    return RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {

            document.getElementById("videos_btnListo").parentElement.style.display = "block";
        }
    });
}

function getMisGuifos() {

    let localSt = localStorage.getItem('gifs');
    document.getElementById("videos_divContenedorMisGuifos").innerHTML = '';

    if (localSt != null) {
        let arrayGifs = localSt.split('|');

        let cantFilas = Math.ceil(arrayGifs.length / 4);
        document.getElementById("videos_divContenedorMisGuifos").style.gridTemplateRows = 'repeat(' + cantFilas + ', calc((100vw - 240px)*0.25 - 12px))';

        for (g of arrayGifs) {

            let div = document.createElement('div');
            div.style.backgroundImage = 'url(' + g + ')';
            div.className = 'misGuifos';

            document.getElementById("videos_divContenedorMisGuifos").appendChild(div)

        }
    }

}

function applyTheme() {

    let theme = sessionStorage.getItem('theme');

    if (theme == "dayTheme") {

        Array.from(document.getElementsByClassName("nightTheme")).forEach(e => {
            e.classList.add("dayTheme");
            e.classList.remove("nightTheme");
            document.getElementById("videos_logoGifos").setAttribute("src", "../assets/gifOF_logo.png");
            document.getElementById("videos_arrowBack").setAttribute("src", "../assets/arrow.svg");
            document.getElementById("videos_imgCamara").setAttribute("src", "../assets/camera.svg");
        })

    } else if (theme == "nightTheme") {

        Array.from(document.getElementsByClassName("dayTheme")).forEach(e => {
            e.classList.add("nightTheme");
            e.classList.remove("dayTheme");
            document.getElementById("videos_logoGifos").setAttribute("src", "../assets/gifOF_logo_dark.png");
            document.getElementById("videos_arrowBack").setAttribute("src", "../assets/arrow.svg");
            document.getElementById("videos_imgCamara").setAttribute("src", "../assets/camera_light.svg");
        })

    }
}

function addEventClose() {
    Array.from(document.getElementsByClassName("btnCloseSugeridos")).forEach(btnclose => {
        btnclose.addEventListener("click", function() {
            document.getElementById("videos_divChequeo").style.display = "none"
        })
    })
}