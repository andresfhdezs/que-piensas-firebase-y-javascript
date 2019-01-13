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

firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    // User is signed in.
    console.log("Usuario activo")
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if (user != null) {

      user.updateProfile({
        displayName: "Pamela Anderson",
        photoURL: "http://lorempixel.com/100/100/people/9/",
      }).then(function () {
        // Update successful.
      }).catch(function (error) {
        // An error happened.
      });


      user_photo = document.getElementById("user_photo");
      user_portada = document.getElementById("user_portada");
      user_nombre = document.getElementById("user_nombre");


      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Email: " + profile.email);
        user_nombre.innerHTML = '<div id="user_nombre" class="h5">' + profile.displayName + '</div>';

        user_photo.innerHTML = '<img src="' + profile.photoURL + '" alt="" class="img-fluid card-img-top rounded-circle">';
      });

      // Leer Post
      var feeds = document.getElementById('feeds');
      
      db.collection("posts").where("userId", "==", user.uid).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          
          console.log(`${doc.id} => ${doc.data()}`);
          feeds.innerHTML += `
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="mr-2">
                    <img class="rounded-circle" width="45" src="${user.photoURL}" alt="">
                  </div>
                  <div class="ml-2">
                    <div class="h5 m-0">${user.displayName}</div>
                    <div class="h7 text-muted">Miracles Lee Cross</div>
                  </div>
                </div>
                </div>
						</div>
					</div>
					<div class="card-body">
						<div class="text-muted h7 mb-2">
							<i class="fa fa-clock-o"></i>10 min ago</div>
						<!-- <a class="card-link" href="#">
							<h5 class="card-title">Lorem ipsum dolor sit amet, consectetur adip.</h5>
						</a> -->

            <p class="card-text">${doc.data().post}</p>
            
            <a href="#" class="card-link">
							<i class="fa fa-gittip"></i> Like</a>
						<a href="#" class="card-link">
							<i class="fa fa-comment"></i> Comment</a>
						<a href="#" class="card-link">
              <i class="fa fa-mail-forward"></i> Share</a>
              <button class="space" onclick="eliminar('${doc.id}')">Eliminar</button>
              <button class="space" onclick="editar('${doc.id}','${doc.data().post}')">Editar</button>
					</div>
					<div class="card-footer ">
						
					</div>
            `;

        });
      });


    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    var post = document.getElementById('post');
    
    console.log("usuario no activo");
  }
});

function login() {

  var userEmail = document.getElementById("email_login").value;
  var userPass = document.getElementById("password_login").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  });

}

function register() {

  var userEmail = document.getElementById("email_register").value;
  var userPass = document.getElementById("password_register").value;

  firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  });
  logout();
}

function logout() {
  firebase.auth().signOut();
}

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Agregar post
function guardar() {
  var post = document.getElementById('post').value;

  var alert = document.getElementById('alert');
  var user = firebase.auth().currentUser;
  db.collection("posts").add({
    post: post,
    userId: user.uid,
  })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);

      alert.innerHTML = '<div id="alert" class="alert alert-primary" role="alert">Post agregado</div>';
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

// Borrar post
function eliminar(id) {
  db.collection("posts").doc(id).delete().then(function () {
    limpiar();
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

// Editar documentos
function editar(id, post) {
  document.getElementById('post').value = post;

  var boton = document.getElementById('btn');
  boton.innerHTML = 'Editar';

  boton.onclick = function () {
    var washingtonRef = db.collection("posts").doc(id);

    // Set the "users" field of the person 'DC'
    var post = document.getElementById('post').value;

    return washingtonRef.update({
      post: post
    })
      .then(function () {
        console.log("Document successfully updated!");
        boton.innerHTML = 'Guardar';
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

}

function limpiar(){
  $('#feeds').remove();
  var midiv = document.createElement("div");
		midiv.setAttribute("id","feeds");
    //midiv.innerHTML = "<p>Este es el contenido de mi div</p>";
    document.getElementById('content-feeds').appendChild(midiv);
    //document.body.appendChild(midiv); // Lo pones en "body", si quieres ponerlo dentro de algún id en concreto usas 
}