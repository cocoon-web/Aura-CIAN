// Importa las funciones de Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Agrega la importación del SDK de Gemini
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Tu clave de API de Gemini
const GEMINI_API_KEY = "AIzaSyB644y_1O0efs2OV0l4i9NeDC_gthh3UJQ";

// Inicializa el modelo
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Tu configuración de Firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-ckAS1vLdQl_hL_awI5Fem-zWjvB6k88",
  authDomain: "aura-coaching-ia.firebaseapp.com",
  projectId: "aura-coaching-ia",
  storageBucket: "aura-coaching-ia.firebasestorage.app",
  messagingSenderId: "284686231119",
  appId: "1:284686231119:web:bae3a7789c9d8f304dec3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elementos del DOM para las pantallas
const authScreen = document.getElementById('auth-screen');
const declarationsScreen = document.getElementById('declarations-screen');
const chatScreen = document.getElementById('chat-screen');

// Elementos del DOM para la autenticación
const googleLoginBtn = document.getElementById('google-login-btn');
const logoutBtn = document.getElementById('logout-btn');
const acceptBtn = document.getElementById('accept-btn');

// Elementos del DOM para el chat
const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const auraTimeSlider = document.getElementById('aura-time-slider');
const auraTimeDisplay = document.getElementById('aura-time-display');
const perfilCalmaBtn = document.getElementById('perfil-calma');
const perfilCreatividadBtn = document.getElementById('perfil-creatividad');
const perfilAccionBtn = document.getElementById('perfil-accion');
const perfilComunicacionBtn = document.getElementById('perfil-comunicacion');

let chatHistory = [];
let conversationContext = "Eres Aura, un asistente de IA neuroafirmativa. Tu rol es colaborar con el usuario para ayudarle a alcanzar sus metas personales. Mantén un tono empático y positivo. Evita dar consejos médicos o legales y siempre promueve la autonomía del usuario. Inicia la conversación con una pregunta abierta. ";
let currentProfile = "general"; // Perfil por defecto

// -------------------------------------------------------------
// Lógica de Autenticación y Flujo de Pantallas
// -------------------------------------------------------------

// Maneja el inicio de sesión con Google
googleLoginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log('Usuario autenticado:', result.user);
    })
    .catch((error) => {
      console.error('Error de autenticación:', error);
    });
});

// Detecta cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    authScreen.classList.add('hidden');
    declarationsScreen.classList.remove('hidden');
  } else {
    authScreen.classList.remove('hidden');
    declarationsScreen.classList.add('hidden');
    chatScreen.classList.add('hidden');
  }
});

// Maneja la aceptación del consentimiento
acceptBtn.addEventListener('click', () => {
  declarationsScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
});

// Maneja el cierre de sesión
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('Sesión cerrada');
    chatHistory = [];
  }).catch((error) => {
    console.error('Error al cerrar sesión:', error);
  });
});

// -------------------------------------------------------------
// Lógica del Chat con Gemini
// -------------------------------------------------------------

// Función para obtener la respuesta de Gemini
async function runChat(prompt) {
  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const fullPrompt = conversationContext + prompt;
  const result = await chat.sendMessage(fullPrompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

// Envía el mensaje del usuario y obtiene la respuesta de Aura
sendBtn.addEventListener('click', async () => {
  const userMessage = userInput.value;
  if (userMessage.trim() === '') return;

  // Muestra el mensaje del usuario
  addMessageToChat(userMessage, 'user-message');
  userInput.value = '';

  // Agrega el mensaje del usuario al historial
  chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // Muestra un mensaje de carga
  const loadingDiv = addMessageToChat('Aura está pensando...', 'aura-message');

  // Obtiene la respuesta de Aura
  try {
    const auraResponse = await runChat(userMessage);

    // Actualiza el historial con la respuesta de Aura
    chatHistory.push({
      role: "model",
      parts: [{ text: auraResponse }],
    });

    // Actualiza el mensaje de carga con la respuesta de Aura
    loadingDiv.textContent = auraResponse;
    loadingDiv.classList.remove('loading-message');

  } catch (error) {
    console.error('Error en la comunicación con la IA:', error);
    loadingDiv.textContent = 'Hubo un error. Por favor, intenta de nuevo.';
  }
});

// Función para agregar mensajes al chat
function addMessageToChat(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  messageDiv.textContent = text;
  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight; // Desplazamiento automático
  return messageDiv;
}

// -------------------------------------------------------------
// Lógica de Temporizador y Perfiles
// -------------------------------------------------------------

// Controla el deslizador de tiempo
auraTimeSlider.addEventListener('input', (event) => {
  const minutes = event.target.value;
  auraTimeDisplay.textContent = `${minutes} min`;
});

// Maneja la selección de perfiles de coaching
perfilCalmaBtn.addEventListener('click', () => setProfile('calma'));
perfilCreatividadBtn.addEventListener('click', () => setProfile('creatividad'));
perfilAccionBtn.addEventListener('click', () => setProfile('accion'));
perfilComunicacionBtn.addEventListener('click', () => setProfile('comunicacion'));

function setProfile(profile) {
  currentProfile = profile;
  let newContext = "";
  // Define el contexto para cada perfil
  switch (profile) {
    case 'calma':
      newContext = "Tu objetivo es ayudar al usuario a encontrar la calma. Tu tono debe ser suave, tranquilizador y pacífico. Utiliza preguntas que fomenten la reflexión y la respiración consciente.";
      break;
    case 'creatividad':
      newContext = "Tu objetivo es fomentar la creatividad. Tu tono debe ser inspirador y exploratorio. Anima al usuario a pensar fuera de lo convencional y a generar nuevas ideas.";
      break;
    case 'accion':
      newContext = "Tu objetivo es ayudar al usuario a tomar acción. Tu tono debe ser directo, motivador y orientado a resultados. Ayuda al usuario a definir pasos concretos y a superar la inercia.";
      break;
    case 'comunicacion':
      newContext = "Tu objetivo es mejorar las habilidades de comunicación del usuario. Tu tono debe ser claro y asertivo. Guíalo para expresar ideas de forma efectiva y para entender a los demás.";
      break;
  }
  conversationContext = newContext;
  console.log('Perfil actualizado a:', currentProfile);
  // Opcional: Reiniciar la conversación para aplicar el nuevo contexto
  chatHistory = [];
  addMessageToChat(`Has cambiado el perfil a "${currentProfile}". ¿En qué puedo ayudarte con esto?`, 'aura-message');
}