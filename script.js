const BASE_URL = "https://lapticon-backend.onrender.com/";
const FIREBASE_API_KEY = "AIzaSyAuh64b_I2OtC7KYuubCVx9plEe2pojp2M";

let idToken = null;
let uid = null;
const loginStatus = document.getElementById("login-status")
const loginSection = document.getElementById("login-section")

// Bloque 1: Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const data = await res.json();

  // ToDo: si res.ok es false, mostrar el error en #login-status y detenerte
  // TODO: guardar data.idToken en idToken y data.localId en uid
  // TODO: ocultar #login-section, mostrar #app-section
  // TODO: llamar a cargarCiudades() y cargarEncomiendas()
  if(!res.ok){
     loginStatus.textContent= "fallo el inicio de sesion"
     console.error("nipurat")
     return
  }

  idToken=data.idToken
  uid=data.localId
  loginSection.classList.add("hidden")

  cargarCiudades()
  cargarEncomiendas()

  

});

// Bloque 2: Catálogo de ciudades
async function cargarCiudades() {
  const paisesRes = await fetch(`${BASE_URL}api/ciudades/paises`);
  const ciudadesRes = await fetch(`${BASE_URL}api/ciudades/ciudades`);

  // TODO: leer los JSON de ambas respuestas (paisesRes.json(), ciudadesRes.json())
   const data = await paisesRes.json()
   console.log(data)

  // TODO: llenar #origen-select y #destino-select con un <option> por cada ciudad
}

// Bloque 3: Crear encomienda
document.getElementById("encomienda-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    ciudadOrigen: document.getElementById("origen-select").value,
    ciudadDestino: document.getElementById("destino-select").value,
    valor: document.getElementById("valor-input").value,
    moneda: document.getElementById("moneda-select").value,
    observaciones: document.getElementById("observaciones-input").value,
  };

  const res = await fetch(`${BASE_URL}/api/encomiendas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  // TODO: mostrar mensaje de éxito/error en #encomienda-status
  // TODO: volver a llamar cargarEncomiendas() para refrescar la tabla
});

// Bloque 4: Listar mis encomiendas
async function cargarEncomiendas() {
  const res = await fetch(`${BASE_URL}/api/encomiendas`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const data = await res.json();

  // TODO: limpiar #encomiendas-body
  // TODO: por cada encomienda, crear una <tr> con sus datos y un botón "Cancelar"
  //       que llame a cancelarEncomienda(encomienda._id)
}

// Bloque 5 (reto opcional): cambiar estado
async function cancelarEncomienda(encomiendaId) {
  const res = await fetch(`${BASE_URL}/api/encomiendas/${encomiendaId}/estado`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ estado: "cancelada" }),
  });

  // TODO: actualizar la fila en pantalla sin recargar la página
}