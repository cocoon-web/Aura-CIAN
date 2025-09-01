// **PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE**
// const firebaseConfig = {
//   apiKey: "...",
//   authDomain: "...",
//   ...
// };

const firebaseConfig = {
  apiKey: "AIzaSyA-ckAS1vLdQl_hL_awI5Fem-zWjvB6k88",
  authDomain: "aura-coaching-ia.firebaseapp.com",
  projectId: "aura-coaching-ia",
  storageBucket: "aura-coaching-ia.firebasestorage.app",
  messagingSenderId: "284686231119",
  appId: "1:284686231119:web:bae3a7789c9d8f304dec3a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Referencias a los elementos del DOM
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const googleLoginBtn = document.getElementById('google-login');

// Función para cambiar de pantalla
function showScreen(screenToShow) {
    if (screenToShow === 'screen-1') {
        screen1.classList.remove('hidden');
        screen2.classList.add('hidden');
    } else {
        screen1.classList.add('hidden');
        screen2.classList.remove('hidden');
    }
}

// Escuchar el estado de autenticación del usuario
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuario logueado, mostrar la segunda pantalla
        console.log("Usuario logueado:", user);
        showScreen('screen-2');
    } else {
        // Usuario no logueado, mostrar la primera pantalla
        console.log("Usuario deslogueado");
        showScreen('screen-1');
    }
});

// Manejar el inicio de sesión con Google
googleLoginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            // Éxito en el inicio de sesión
            console.log("Inicio de sesión exitoso con Google:", result.user);
        })
        .catch((error) => {
            // Manejar errores
            console.error("Error de inicio de sesión con Google:", error);
        });
});

// Manejar el cambio de idioma
document.getElementById('lang-es').addEventListener('click', () => {
    console.log("Idioma cambiado a ES");
});
document.getElementById('lang-en').addEventListener('click', () => {
    console.log("Idioma cambiado a EN");
});