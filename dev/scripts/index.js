var findIgnMap = require('find-ign-map');
var getJSON = require('./get-json.js');

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[#&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}

function mergeArray(a, b, prop) {
    var reduced = a.filter(function (aitem) {
        return !b.find(function (bitem) {
            return aitem[prop] === bitem[prop];
        });
    });
    return reduced.concat(b);
}

function getDate(time) {
    var date = new Date(); 
    date.setTime(time);
    var dd = date.getDate(); 
    var mm = date.getMonth() + 1; 

    var yyyy = date.getFullYear(); 
    if (dd < 10) { 
        dd = '0' + dd; 
    } 
    if (mm < 10) { 
        mm = '0' + mm; 
    } 
    return dd + '/' + mm + '/' + yyyy; 
}

var mapsContainer = document.getElementById('maps-container');

function displayMaps(arr) {
    while (mapsContainer.firstChild) {
        mapsContainer.removeChild(mapsContainer.firstChild);
    }
    arr.forEach(function (el) {
        var div = document.createElement('div');
        div.classList.add('card');

        var p1 = document.createElement('p');
        var s1 = document.createElement('span');
        s1.classList.add('title-meta');
        s1.innerHTML = 'Description:';
        var s2 = document.createElement('span');
        s2.innerHTML = el.description;
        p1.appendChild(s1);
        p1.appendChild(s2);
        div.appendChild(p1);

        var p2 = document.createElement('p');
        var s3 = document.createElement('span');
        s3.classList.add('title-meta');
        s3.innerHTML = 'Code:';
        var s4 = document.createElement('span');
        s4.innerHTML = el.code;
        s4.classList.add('code');
        p2.appendChild(s3);
        p2.appendChild(s4);
        div.appendChild(p2);

        var p3 = document.createElement('p');
        var s5 = document.createElement('span');
        s5.classList.add('title-meta');
        s5.innerHTML = 'Catégorie:';
        var s6 = document.createElement('span');
        s6.innerHTML = el.category;
        p3.appendChild(s5);
        p3.appendChild(s6);
        div.appendChild(p3);

        var p4 = document.createElement('p');
        var s7 = document.createElement('span');
        s7.classList.add('title-meta');
        s7.innerHTML = 'Date de publication:';
        var s8 = document.createElement('span');
        s8.innerHTML = getDate(el.date);
        p4.appendChild(s7);
        p4.appendChild(s8);
        div.appendChild(p4);

        var p5 = document.createElement('p');
        var s9 = document.createElement('span');
        s9.classList.add('title-meta');
        s9.innerHTML = 'Année d\'édition:';
        var s10 = document.createElement('span');
        s10.innerHTML = el.editDate;
        p5.appendChild(s9);
        p5.appendChild(s10);
        div.appendChild(p5);

        var a = document.createElement('a');
        a.href = 'https://ignrando.fr/boutique/catalogsearch/result/?q=' + el.code;
        a.innerHTML = 'Voir sur le site IGN';
        a.target = '_blank';
        div.appendChild(a);

        mapsContainer.appendChild(div)
    });
    if (arr.length == 0) {
        var p = document.createElement('p');
        p.innerHTML = 'Aucune carte trouvée, service disponible uniquement pour la France métropolitaine.'
        p.classList.add('info');
        mapsContainer.appendChild(p);
    }
}

function lookForUri() {
    var vars = getUrlVars();
    if (vars.hasOwnProperty('rando')) {
        getJSON('https://decouverto.fr/api/walks/' + vars.rando + '/center', function (err, data) {
            if (err) return console.error(err);
            var centerMaps = findIgnMap([data.center.longitude, data.center.latitude]);
            var firstPointMaps = findIgnMap([data.first_point.longitude, data.first_point.latitude]);
            var arr = mergeArray(centerMaps, firstPointMaps, 'code');
            displayMaps(arr);
            document.getElementById('no-data').style.display = 'none';
            document.getElementById('data-received').style.display = 'block';
        });
    }
}

window.onload = lookForUri;
document.getElementById('btn').onclick = function () {
    var lat = document.querySelector('#lat-input').value;
    var lng = document.querySelector('#lng-input').value;
    var arr = findIgnMap([lng, lat]);
    displayMaps(arr);
    document.getElementById('data-received').style.display = 'none';
}