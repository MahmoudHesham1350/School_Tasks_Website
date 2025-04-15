const URL = "http://127.0.0.1:5500/"

async function fetchData(path) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `${URL}${path}`, true);    
    xhttp.onload = function() {
        resolve(this.responseText);
    };
    xhttp.send();
  });
};

