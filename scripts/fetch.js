const URL = location.protocol + '//' + location.host + "/";

async function fetchData(path) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    console.log(`${URL}${path}`)
    xhttp.open("GET", `${URL}${path}`, true);    
    xhttp.onload = function() {
        resolve(this.responseText);
    };
    xhttp.send();
  });
};

