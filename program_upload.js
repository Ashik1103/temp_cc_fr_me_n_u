var p = 1;
var database = firebase.firestore();
var program_id;
var id;
var Labname;

document.getElementById("loader").style.display="none";

function toggleVisibility(checkbox, id) {
  
  var content = document.getElementById(id);
  
  if(checkbox.checked == true) {
    content.style.display = "block";
    checkbox.checked = "false";
  }
  
  else {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
    
    if(!checkedOne) {
      checkbox.checked = "true";
    } else {
      content.style.display = "none";
    }
  }
}


var uiddd;
var firestore = firebase.firestore();

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    console.log("==================== ", user);
    getUser(user.uid);
    uiddd = user.uid;

    getHistory(user.uid);
  } else {
    // No user is signed in.
    window.location.replace("/Users/ketan_priya/Desktop/vsc/compile-anywhere-master/compile-anywhere/landing.html");
  }
});

const getUser = (uiddd) => {
  firestore
    .collection("faculty-user")
    .where("uid", "==", uiddd)
    .get()
    .then((result) => {
      // console.log("============== ", result);
      if (result.docs.length == 1) {
        // console.log("============== ", result.docs[0].data());
        const name = result.docs[0].data().userName;
        const Email = result.docs[0].data().Email;
        document.querySelector("#name1").innerText = name;
        document.querySelector("#name2").innerText = Email;
      }
    });
};

const getHistory = (uiddd) => {
  let tableData = [];
  firestore
    .collection("lastedited")
    //now i added
    .where("name", "==", uiddd)
    .get()
    .then((result) => {
      result.docs.forEach((element) => {
        console.log("============== ", element.data());
        tableData.push({
          labcode: element.data().labcode,
          progname: element.data().progname,
          action: element.data().Details.action,
          date: element.data().Details.dateandtime,
        });
      });
      bindDataToDataTable(tableData);
    });
};


const docProfile = database.collection("faculty-user").doc();
const docDetail = database.collection("lastedited").doc();
const outputHeader1 = document.querySelector("#program_num");
const outputHeader2 = document.querySelector("#blank");
const progDesc = document.querySelector("#progDesc");
const progCode = document.querySelector("#progCode");
const progInput = document.querySelector("#runTimeInput");
const progOutput = document.querySelector("#progOutput");
const progTitle = document.querySelector("#latestTitle");
const lang = document.querySelector("#language"); 
const osUsed = document.querySelector("#os"); 
const softwareUsed = document.querySelector("#software"); 
const tagUsed = document.querySelector("#thisValue3"); 
const youtubeLink = document.querySelector("#site"); 
const saveButton = document.querySelector("#saveButton");
const undoButton = document.querySelector("#undoButton");

function save_details() {
    var d = new Date();
    document.getElementById("loader").style.display="block";
    
    setTimeout(function(){ 
        $('.loader').css('display', 'none');
    }, 2000); // it will remove after 5 seconds
    
    const saveTitle = progTitle.value;
    const saveDesc = progDesc.value;
    const saveCode = progCode.value;
    const saveInput = progInput.value;
    const saveOutput = progOutput.value;
    const saveLang = lang.value;
    const saveOs = osUsed.value;
    const saveSoftware = softwareUsed.value;;
    const saveLink = youtubeLink.value;
    var saveDate = d.toUTCString();
    var sDate = d.toLocaleDateString();
    var sTime = d.toLocaleTimeString();

    var x = document.querySelectorAll(".tag");
    var tag1 = [];

    for (let i = 0; i < x.length; i++) {
        const element = x[i];
        var hi = element.innerText.indexOf("close");
        var finall = element.innerText.substr(0,hi).trim();
        tag1.push(finall);
    }
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uidd = user.uid;
            database.collection("programs").doc(program_id).update({
                Program_Title: saveTitle,
                Program_Description: saveDesc,
                Program_Code: saveCode,
                Program_Input: saveInput,
                Program_Output: saveOutput,
                Language: saveLang,
                Os_used: saveOs,
                Software_used: saveSoftware,
                Tags: tag1,
                Date: sDate,
                Time: sTime,
                Youtube_link: saveLink,
                Uid: uidd
            })
            .then(function () {
              document.querySelector('#blank').innerHTML = Program_Title + ". . . Last edited on " + sDate +" at " + sTime;
            })
            .catch(function (error) {
                console.log("got an error:", error);
            });
        }
    });
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // var uid1 = user.uid;
            docDetail
            .set({
              currentStatus: "Available",
              progname: "something",
              labcode: "19cs0xx",
              Details:{
                Uid: "HfgSDDfgfNvCdGNgmHGfhgcBVbnV",
                action: "edited",
                dateandtime: saveDate
              },
              name: uiddd
            })
            .then(function () {
              console.log("status saved!");
            })
            .catch(function (error) {
              console.log("got an error:", error);
            });
        }
    });
    
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

var modal = document.getElementById('hint');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  
  if (event.target == modal) {
    
    modal.style.display = "none";
    
  }
}

function changeModal(){
  document.getElementById("modalIN").style.display = "none";
  document.getElementById("modal").style.display = "block";
}

const tagContainer = document.querySelector('.tag-container');

const input = document.querySelector('.tag-container input');

var tags = [];

function createTag(label){
  const div = document.createElement('div');
  div.setAttribute('class','tag');
  const span = document.createElement('span');
  span.innerHTML = label;
  const closeBtn = document.createElement('i');
  closeBtn.setAttribute('class','material-icons close');
  closeBtn.setAttribute('data-item', label);
  closeBtn.innerHTML = 'close';
  
  div.appendChild(span);
  div.appendChild(closeBtn);
  return div;
}

function reset() {
  document.querySelectorAll('.tag').forEach(function(tag){
    tag.parentElement.removeChild(tag);
  })
}

function addTags(){
  reset();
  tags.slice().reverse().forEach(function(tag){
    const input = createTag(tag);
    tagContainer.prepend(input);
  })
}

input.addEventListener('keyup', function(e){
  if(e.key === 'Enter'){
    tags.push(input.value);
    addTags();
    input.value = '';
  }
})

document.addEventListener('click',function(e){
  if(e.target.tagName ===  "I"){
    const value = e.target.getAttribute('data-item');
    const index = tags.indexOf(value);
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    addTags();
  }
})

$(document).on('click', 'a', function(e) {
  e.preventDefault();
  e = $(this).text();//This gets the text
  $('.drop3').val(e);
});

function backToList(){
  window.location.replace("/Users/ketan_priya/Desktop/vsc/compile-anywhere-master/compile-anywhere/home.html");
}

function showUp(){
  $('.sem').on('click', function(){
    $('.sem').removeClass('decide');
    $(this).addClass('decide');
  }); 
}

function program(x,y){
  showUp();
  var reset = document.getElementById(x);
  var del = document.getElementById(y);
  if(p==1){
    reset.style.display="block";
    del.style.display="block";
    p=0;
  }
  else{
    reset.style.display="none";
    del.style.display="none";
    p=1;
  } 
}

function program_details(x, y, id, program_no) {
  program(x, y);
    database.collection("programs").doc(id).get().then((querySnapshot) => {
      const Data = querySnapshot.data();
      document.querySelector("#program_num").innerHTML = 'Program #' + program_no + ": " + querySnapshot.data().Program_Title;
      if(Data.Date != "" && Data.Time != "") {
        document.querySelector('#blank').innerHTML = ". . . Last edited on " + Data.Date +" at " + Data.Time;
      }
      document.querySelector("#program_num").innerHTML = 'Program #' + program_no + ": " + querySnapshot.data().Program_Title;
      document.getElementById('latestTitle').value = Data.Program_Title;
      document.getElementById('progDesc').value = Data.Program_Description;
      document.getElementById('progCode').value = Data.Program_Code;
      document.getElementById('runTimeInput').value = Data.Program_Input;
      document.getElementById('progOutput').value = Data.Program_Output;
      document.getElementById('language').value = Data.Language;
      document.getElementById('os').value = Data.Os_used;
      document.getElementById('software').value = Data.Software_used;
      document.getElementById('site').value = Data.Youtube_link;
    
    program_id = querySnapshot.id;
  });
}

function checkCookies() { 
  id = window.localStorage.getItem('id');
  database.collection("programs").doc(id).get().then((querySnapshot) => {
    Labname = querySnapshot.data().Lab;
    document.querySelector("#Labname").innerHTML = Labname;
    retrieve_programs(Labname);
  });
}

function retrieve_programs(Labname) {
  var program_list = {};
  labname = Labname;
  var i = 1;
  database.collection("programs").where("Lab", "==", Labname).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      program_no = i++;
      displayProgram(program_no, doc.id);
      program_list[doc.data().Program_no] =  doc.data().Program_Title;
    });
  });
}

function displayProgram(program_no, id) {
  let program = `<div class="sem" onclick="program_details('reset_it','delete_it', '${id}', ${program_no})">
  <div class="row no-gutters">
      <div class="col-9">
          <span class="sem_font">Program #${program_no}</span>
      </div>
      <span class="col-2">
          <div class="duo">
              <span id="reset_it" class="material-icons reset" data-target="#trash_modalreset" data-toggle="modalreset" onclick="document.getElementById('reset_me').style.display='block'"></span>
              <div id="reset_me" class="modalreset">
                  <form class="modal-content_reset" action="/action_page.php">
                      <div class="container_reset">
                          <span class="pop_reset">Are you sure ?</span>
                          <div class="clearfix_reset">
                              <button type="button" onclick="document.getElementById('reset_me').style.display='none'" class="cancelbtn">Cancel</button><br>
                              <button type="button" onclick="document.getElementById('reset_me').style.display='none'" class="deletebtn">Yes, reset</button>
                          </div>
                      </div>
                  </form>
              </div>
              <span id="delete_it" class="material-icons delete" data-target="#trash_modaldelete" data-toggle="modaldelete" onclick="document.getElementById('delete_me').style.display='block'"></span>
              <div id="delete_me" class="modaldelete">
                  <form class="modal-content_delete" action="/action_page.php">
                      <div class="container_delete">
                          <span class="pop_delete">Are you sure ?</span>
                          <div class="clearfix_delete">
                              <button type="button" onclick="document.getElementById('delete_me').style.display='none'" class="cancelbtn">Cancel</button><br>
                              <button type="button" id="soDelete" onclick="document.getElementById('delete_me').style.display='none'" class="deletebtn">Yes, delete</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </span>
  </div>
  </div>`

  document.querySelector("#sem_list").innerHTML += program;
}
