window.onload = function() {
  var pred = document.getElementById('pred');
  var req = new XMLHttpRequest();
  req.onload = function() {
    var p = JSON.parse(this.responseText);
    pred.className = p.x;
  };
  req.open('get','/api/predict');
  req.send();
};
