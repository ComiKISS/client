function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

function loadServer(server) {
  server = server instanceof Object ? document.getElementById("server").value : (server ? server : "");
  document.getElementById("server").value = server;
  console.log(server);
  if(isURL(server)) {
    localStorage.setItem("currentServer", server);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        renderPage(JSON.parse(this.responseText), "list");
      }
    };
    xhttp.open("POST", server, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=list");
  } else {
    alert("Invalid URL");
  }
}

function loadComic(event) {
  console.log(event);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      renderPage(JSON.parse(this.responseText), "comic", event.target.dataset.id);
    }
  };
  xhttp.open("POST", localStorage.getItem("currentServer"), true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("action=comic&id=" + event.target.dataset.id);
}

function update_db(action, id) {
  return function() {
    alert("edit " + action + " " + id);
  }
};

function renderPage(data, action, id) {
  if(data.error) {
    return alert(data.error);
  }

  document.getElementById("content").innerHTML = "";

  var edit = document.createElement("input");
  edit.type = "button";
  edit.value = "Edit";
  edit.id = "edit";
  edit.addEventListener("click", update_db(action, id));
  document.getElementById("content").appendChild(edit);

  if(action == "list") {
    // search bar here
    for (var entry in data["response"]) {
      var link = document.createElement("a");
      link.addEventListener("click", loadComic);
      link.className += "comic";
      link.setAttribute("data-id", data["response"][entry].id);
      link.href = "#";

      /*
      for (var cover in data["response"][entry].covers) {
        var cover = document.createElement("img");
        cover.src = localStorage.getItem("currentServer") + data["response"][entry].covers[0];
        link.appendChild(cover);
      }
      */
      var title = document.createTextNode(data["response"][entry]["titles"][0]);
      if(data["response"][entry]["private"]) link.className += " private";
      link.appendChild(title);

      document.getElementById("content").appendChild(link);
    }
  }

  if(action == "comic") {
    var link = document.createElement("a");
    link.className += "titles";
    link.href = "#";
    for (var title in data.response.titles) {
      var entry = document.createElement("span");
      var text = document.createTextNode(data.response.titles[title]);
      entry.appendChild(text);
      link.appendChild(entry);
    }
    document.getElementById("content").appendChild(link);
    var genre_div = document.createElement("div");
    genre_div.className += "genres";
    for (var genre in data.response.genres) {
      var entry = document.createElement("a");
      entry.href = "#";
      entry.appendChild(document.createTextNode(data.response.genres[genre]));
      genre_div.appendChild(entry);
    }
    document.getElementById("content").appendChild(genre_div);
    for (var volume in data.response.volumes) {
    }
    for (var author in data.response.authors) {
    }
    for (var artist in data.response.artists) {
    }
    for (var cover in data.response.covers) {
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  if (localStorage.getItem("currentServer")) {
    loadServer(localStorage.getItem("currentServer"));
  }

  document.getElementById("server-submit").addEventListener("click", loadServer);
});
