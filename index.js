// Initialize Firebase
var config = {
  apiKey: "AIzaSyCpGxX_3Ku1pknQ2fGlKnlLbaabSKafI5Q",
  authDomain: "fir-web-login-f4ebb.firebaseapp.com",
  databaseURL: "https://fir-web-login-f4ebb.firebaseio.com",
  projectId: "fir-web-login-f4ebb",
  storageBucket: "fir-web-login-f4ebb.appspot.com",
  messagingSenderId: "960970973180"
};
firebase.initializeApp(config);
var name, email, photoUrl, uid, emailVerified;

firebase.auth().onAuthStateChanged(function(user) {
  
  if (user) {
    // User is signed in.
    console.log("Usuario activo")
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;
    
    if(user != null){
           
      user.updateProfile({
        displayName: "Pamela Anderson",
        photoURL: "http://lorempixel.com/100/100/people/9/"
      }).then(function() {
        // Update successful.
      }).catch(function(error) {
        // An error happened.
      });
      

      user_photo = document.getElementById("user_photo");
      user_portada = document.getElementById("user_portada");
      user_nombre = document.getElementById("user_nombre");
      

      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Email: " + profile.email);
        user_nombre.innerHTML = '<span class="card-title">' + profile.displayName + '</span>'
        user_portada.innerHTML = '<img class="card-bkimg" alt="" src="' + profile.photoURL + '">';
        user_photo.innerHTML = '<img alt="" src="' + profile.photoURL + '">';
      });

      

      // Leer Post
      var tabla = document.getElementById('tabla');
      
      db.collection("posts").where("userId","==",user.uid).onSnapshot((querySnapshot) => {
        tabla.innerHTML = '';
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            tabla.innerHTML += `
            <tr>
            <th scope="row">${doc.id}</th>
            <td>${doc.data().post}</td>
            <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
            <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().post}')">Editar</button></td>
            </tr>
            `;
        });
    });

      
      }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    var tabla = document.getElementById('tabla');
    tabla.innerHTML = '';
    console.log("usuario no activo");
  }
});

function login(){

  var userEmail = document.getElementById("email_login").value;
  var userPass = document.getElementById("password_login").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  });

}

function register(){

  var userEmail = document.getElementById("email_register").value;
  var userPass = document.getElementById("password_register").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  });
  logout();
}

function logout(){
  firebase.auth().signOut();
}

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Agregar post
function guardar(){
  var post = document.getElementById('post').value;

  var alert = document.getElementById('alert');
  var user = firebase.auth().currentUser;

  db.collection("posts").add({
      post: post,
      userId: user.uid,
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      document.getElementById('post').value = '';
      
      alert.innerHTML = '<div id="alert" class="alert alert-primary" role="alert">Post agregado</div>';
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

// Borrar post
function eliminar(id){
  db.collection("posts").doc(id).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

// Editar documentos
function editar(id, post){
  document.getElementById('post').value = post;

  var boton = document.getElementById('btn');
  boton.innerHTML = 'Editar';

  boton.onclick = function(){
      var washingtonRef = db.collection("posts").doc(id);

      // Set the "users" field of the person 'DC'
      var post = document.getElementById('post').value;

      return washingtonRef.update({
          post: post
      })
      .then(function() {
          console.log("Document successfully updated!");
          boton.innerHTML = 'Guardar';
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
  }
  
}