var socket = io();

function updatePage(name,data){
  let html = "";
  if(name=="!broadcast"){
    html = data;
  }
  else{
    switch(data) {
      case 1:
          html = name + " completed the SSH Station!";
          break;
        default:
          html = name + " completed a station!";
      }
  }
      var table = document.getElementById("myTable");
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      cell1.innerHTML =  html;
      var x = document.getElementById("myTable").rows.length;
      if(x==5){document.getElementById("myTable").deleteRow(x-1);}
}
  socket.on('update', function (data) {
    console.log(data);
    updatePage(data.name,data.data);
  });
