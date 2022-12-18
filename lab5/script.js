window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

function init(){

  //Łącze się do IndexDB
  var request = window.indexedDB.open("MyDatabase", 3);

  request.onerror = function(event) {
    alert("Error faced while opening database");
  };
  request.onsuccess = function(event) {
  
    db = event.target.result;
    
    updatetable();
    db.onerror = function(event) {
  
    alert("Database error: " + event.target.errorCode);
    alert("Sprawdź czy nie ma już klienta o podanym peselu!");
    };
  
  };


  function deleteUser(peselId)
  {
    console.log(peselId)
  
    var request = db.transaction(["users"], "readwrite").objectStore("users").delete(peselId);
  
    request.onsuccess = function(event){
    console.log(peselId+" deleted");
    };
  
    updatetable();
  };

  function editUser(pesel)
  {


    var transaction = db.transaction(["users"], "readwrite");
    var store = transaction.objectStore("users");

    var request = store.openCursor();
    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            if (cursor.value.pesel == pesel) {
              document.getElementById('nameInput').value =cursor.value.name;
              document.getElementById('lastNameInput').value =cursor.value.lastname;
              document.getElementById('adresInput').value = cursor.value.adres;
              document.getElementById('PeselInput').value = cursor.value.pesel;
              document.getElementById('PhoneInput').value = cursor.value.phone;
              document.getElementById('MailInput').value = cursor.value.mail;
        
            } else {
                cursor.continue();
            }
        }
    };


  
    updatetable();
}



function randomString(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
document.getElementById('RandomDataButton').onclick = function(e)
{
  document.getElementById('nameInput').value = randomString(['Bartosz','Stanisław','Marcin','Łukasz','Julia', 'Maciej', 'Jan', 'Paweł','Katarzyna']);
  document.getElementById('lastNameInput').value = randomString(['Kowalski','Nowas','Marcinkowski','Bartosik','Wnuk', 'Dobrowolski', 'Marciniak', 'Kałuża','Koza']);
  document.getElementById('adresInput').value = randomString(['Sloneczna 45','Malinowa 0','Zrodlana 10','Pomaranczowa 50','Wroblewskiego 32', 'Brukowa 15', 'Debowa 2']);
  document.getElementById('PeselInput').value = (Math.floor(Math.random() * 99999999999 + 10)).toString();
  document.getElementById('PhoneInput').value = (Math.floor(Math.random() * 999999999 + 10)).toString();
  document.getElementById('MailInput').value = randomString(['janina@gmail.com','wroclaw@onet.com','html@gmail.com','jacek@wp.com','andrzej@outlook.com', 'lukasz@gmail.com']);

};
//window.onload = updatetable();

request.onupgradeneeded = function(event) { 

  var db = event.target.result;
  var objectStore = db.createObjectStore("users", { keyPath: "pesel" });

  objectStore.createIndex("name", "name", {unique:false});

  objectStore.createIndex("lastname", "lastname", {unique:false});

  objectStore.createIndex("adres", "adres", {unique:false});

  objectStore.createIndex("pesel", "pesel", {unique:false});

  objectStore.createIndex("phone", "phone", {unique:false});

  objectStore.createIndex("mail", "mail", {unique:false});

  objectStore.transaction.oncomplete = function(event) {
	
  }
};
var bKontrola;

document.getElementById('EdtButton').onclick = function(e)
{

  var bname = document.getElementById('nameInput').value;
  var blastname = document.getElementById('lastNameInput').value;
  var badres = document.getElementById('adresInput').value;
  var bpesel = document.getElementById('PeselInput').value;
  var bphone = document.getElementById('PhoneInput').value;
  var bmail = document.getElementById('MailInput').value;
  
  const users_item = {
	name: bname,
	lastname: blastname,
	adres: badres,
	pesel: bpesel,
  phone: bphone,
  mail: bmail
  }

  var transaction = db.transaction(["users"], "readwrite");

  transaction.oncomplete = function(event) {
	console.log("all done with transaction");
  };

  transaction.onerror = function(event){
	console.dir(event);
  };

  var usersObjectStore = transaction.objectStore("users");
  var request = usersObjectStore.put(users_item);

  request.onsuccess = function(event){
	console.log("added item");
  };

  updatetable();

}

document.getElementById('addButton').onclick = function(e) {
bKontrola = 1;
  var bname = document.getElementById('nameInput').value;
  var blastname = document.getElementById('lastNameInput').value;
  var badres = document.getElementById('adresInput').value;
  var bpesel = document.getElementById('PeselInput').value;
  var bphone = document.getElementById('PhoneInput').value;
  var bmail = document.getElementById('MailInput').value;
  
  const users_item = {
	name: bname,
	lastname: blastname,
	adres: badres,
	pesel: bpesel,
  phone: bphone,
  mail: bmail
  }

  var transaction = db.transaction(["users"], "readwrite");

  transaction.oncomplete = function(event) {
	console.log("all done with transaction");
  };

  transaction.onerror = function(event){
	console.dir(event);
  };

  var usersObjectStore = transaction.objectStore("users");
  var request = usersObjectStore.add(users_item);

  request.onsuccess = function(event){
	console.log("added item");
  };

  updatetable();

};

function updatetable(){
  document.getElementById("ClientsBody").innerHTML = "";

  var request = db.transaction("users").objectStore("users").openCursor();

  request.onerror = function(event){
	console.dir(event);
  };

  request.onsuccess = function(event){

	cursor = event.target.result;
  var allUsers = [];

  if(cursor != null) {
    allUsers.push(cursor.value)
    cursor.continue();
  }

  
  var tHeadRef  = document.getElementById('ClientsHead').innerHTML =    "<td>IMIE</td><td>NAZWISKO</td><td>ADRES</td><td>PESEL</td><td>TEL</td><td>MAIL</td>";

    allUsers.forEach((element) => {

      
      var tbodyRef  = document.createElement('tbody');

      var nameTd = document.createElement('td');
      nameTd.textContent =  element.name;

      var lastnameTd = document.createElement('td');
      lastnameTd.textContent =  element.lastname;

      var adresTd = document.createElement('td');
      adresTd.textContent =  element.adres;

      var peselTd = document.createElement('td');
      peselTd.textContent =  element.pesel;

      var phoneTd = document.createElement('td');
      phoneTd.textContent =  element.phone;

      var mailTd = document.createElement('td');
      mailTd.textContent =  element.mail;

      tbodyRef.appendChild(nameTd);
      tbodyRef.appendChild(lastnameTd);
      tbodyRef.appendChild(adresTd);
      tbodyRef.appendChild(peselTd);
      tbodyRef.appendChild(phoneTd);
      tbodyRef.appendChild(mailTd);
      
      var full = document.getElementById("ClientsBody");



      var deleteTitle = document.createElement("button");
      deleteTitle.innerText = `Usun`;


      var editTile = document.createElement("button");
      editTile.innerText = `Edytuj`;


      deleteTitle.addEventListener('click', function handleClick(_) {
          deleteUser(element.pesel);
      });

      editTile.addEventListener('click', function handleClick(_) {
        editUser(element.pesel);
    });

    tbodyRef.appendChild(deleteTitle)
    tbodyRef.appendChild(editTile)
      full.appendChild(tbodyRef);
    });
  

  };
}


document.getElementById('searching').onclick = function(e) {
  var keyword = "foo";
  var transaction = db.transaction("users", "readwrite");
  var objectStore = transaction.objectStore("users");
  var request = objectStore.openCursor();
  request.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
          if (cursor.value.column.indexOf(keyword) !== -1) {                
              $('ClientsBody').empty();
          }  
  
          cursor.continue();          
      }
  };




}




}