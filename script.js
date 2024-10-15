let firebaseConfig = {
    apiKey: "AIzaSyBazEJwCXDWQZdhWN3JWyN6JDcaxOGp4mI",
    authDomain: "quiztrivia-32d83.firebaseapp.com",
    projectId: "quiztrivia-32d83",
    storageBucket: "quiztrivia-32d83.appspot.com",
    messagingSenderId: "5093975636",
    appId: "1:5093975636:web:42c36e4af7e22e01716fc1"
  };

firebase.initializeApp(firebaseConfig);

  const formdb = firebase.firestore();
  

  const addData = (user) => {
    formdb.collection("users")
      .add(user)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
        readAll();
      })
      .catch((error) => console.error("Error adding document: ", error));
  };


// // ----------------VALIDACION DE FORMULARIO---------------------------

// const showPasswordCheckbox = document.getElementById('showPassword');
// const passwordInput = document.getElementById('password');

// showPasswordCheckbox.addEventListener('change', function() {
//     passwordInput.type = this.checked ? 'text' : 'password'; // Muestra u oculta la contraseña
// });

// // Función para simular la conexión con Google
// document.getElementById('googleLogin').addEventListener('click', function() {
//     alert('Conectando con Google...');
// });
// document.getElementById("registrationForm").addEventListener("submit", function(event) {
//     const name = document.getElementById("name").value.trim();
//     const username = document.getElementById("username").value.trim();
//     const age = parseInt(document.getElementById("age").value);
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value;

//     // Validación de nombre y usuario
//     if (!name || !username) {
//         alert("Por favor, completa tu nombre y usuario.");
//         event.preventDefault(); // Evita el envío del formulario
//         return;
//     }

//     // Validación de edad
//     if (age < 1 || age > 120) {
//         alert("Por favor, ingresa una edad válida.");
//         event.preventDefault();
//         return;
//     }

//     // Validación de correo
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//         alert("Por favor, ingresa un correo electrónico válido.");
//         event.preventDefault();
//         return;
//     }

//     // Validación de contraseña
//     if (password.length < 6) {
//         alert("La contraseña debe tener al menos 6 caracteres.");
//         event.preventDefault();
//         return;
//     }
// });

// // Mostrar/ocultar contraseña
// document.getElementById("showPassword").addEventListener("change", function() {
//     const passwordField = document.getElementById("password");
//     passwordField.type = this.checked ? "text" : "password";
// });

// ----------------------------------------------------------------------
//-------------------GUARDAR FORM EN LOCALSTORAGE-----------------------
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        // Obtener valores de los campos
        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const age = document.getElementById("age").value;
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Crear un objeto de usuario
        const user = { name, username, age, email, password };

        // Guardar en localStorage
        localStorage.setItem('user', JSON.stringify(user));

        alert("Usuario registrado en localStorage.");
        
        // Reiniciar el formulario si es necesario
        form.reset();
    });
});


let preguntas = []; //array pregutas obtenidas api
let preguntaActual = 0; //índice de preguntas
let puntuacion = 0; //se guarda la puntutación de las preguntas (pocentaje)


async function obtenerPreguntas() {
    try {
        let respuesta = await fetch('https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple');
        if (!respuesta.ok) {
            throw new Error('Error al obtener las preguntas');
        }
        let datos = await respuesta.json();
        return datos.results;
    } catch (error) {
        console.error('Hubo un problema con la solicitud:', error);
    }
}


async function iniciarQuiz() {
    //obtenemos las preguntas de la api 
    preguntas = await obtenerPreguntas();
    //mostramos la primera pregunta
    mostrarPregunta();
}

//respuestas mezcladas
//recibe un array de opciones
//sort = método para ordenar un array con el criterio que le demos
function mezclarOpciones(opciones) {
    return opciones.sort(() => Math.random() - 0.5);
}


function mostrarPregunta() {
    //10 pregutnas
    if (preguntaActual < preguntas.length) {
        let pregunta = preguntas[preguntaActual];
        //muestra la pregunta en el HTML
        document.getElementById('pregunta-texto').textContent = pregunta.question;

        // 4 OPCIONES
        let opcionesLista = document.getElementById('opciones-lista');
        opcionesLista.innerHTML = '';


        // Crear un array para las opciones
        let opciones = [];

        // Respuestas incorrectas
        for (let i = 0; i < pregunta.incorrect_answers.length; i++) {
            opciones.push(pregunta.incorrect_answers[i]);
        }
        // Respuesta correcta
        opciones.push(pregunta.correct_answer);

        opciones = mezclarOpciones(opciones);
        //iteramos sobre cada opción 
        opciones.forEach((opcion) => {
            let li = document.createElement('li');
            //asignamos texto a cada opción 
            li.textContent = opcion;
            li.addEventListener('click', () => verificarRespuesta(opcion === pregunta.correct_answer));
            opcionesLista.appendChild(li);
        });
    } else {
        mostrarResultados();
    }
}


function verificarRespuesta(esCorrecta) {
    if (esCorrecta) {
        puntuacion++;
    }

    //pasar a la siguiente pregunta y mostrarla
    preguntaActual++;
    mostrarPregunta();
}

//  Muestra los resultaods al final 
function mostrarResultados() {
    document.getElementById('pregunta-texto').textContent = `¡Quiz terminado! Tu puntuación es ${puntuacion} de ${preguntas.length}.`;
    document.getElementById('opciones-lista').innerHTML = '';
}


iniciarQuiz();

