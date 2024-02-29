var mymap = L.map('mapa', {zoomControl: false}).setView([49.4415564, 15.8721311], 7); 
            
//vytvoří skupinu s basemapou
var basemapa = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Podkladová mapa &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | Data <a href="https://www.ustrcr.cz/">ÚSTR</a>',
    maxZoom: 18
});
var basemapaGroup = L.layerGroup([basemapa]);
basemapaGroup.addTo(mymap);

//formátuje popupy
function onEachFeature(feature, layer) {
    layer.bindPopup(typeset('<img src="fotky/' + feature.properties.foto + '.png" style="float:left; margin-right:5px; margin-top:3px; margin-bottom:1px"/><span class="jmenoobeti">' + feature.properties.jmeno + ' ' + feature.properties.prijmeni + '</span><br>' + '<strong>Zaměstnání:</strong> ' + feature.properties.povolaniText + '<br>' + '<strong>Věk:</strong> ' + feature.properties.vek + ' let<br>' + '<strong>Datum incidentu:</strong> ' + feature.properties.datumIncidentu + '<br>' + '<strong>Místo incidentu:</strong> ' + feature.properties.mistoIncidentuText + '<br>' + '<strong>Popis incidentu:</strong> ' + feature.properties.zpusobUsmrceniText) );
}

//dá do pravého rohu zoomovací tlačítka
if(window.innerWidth>768) {
    L.control.zoom({
        position:'topright'
    }).addTo(mymap);

    L.control.defaultExtent({
        position:'topright'
    }).addTo(mymap);
}

if(window.innerWidth<=768) {
    L.control.zoom({
        position:'topright'
    }).addTo(mymap);
    
    L.control.defaultExtent({
        position:'topright'
    }).addTo(mymap);
}

//sidebar
var sidebar = L.control.sidebar('sidebar').addTo(mymap);

//vytvoří proměnou s daty 
var obeti = geojsonFeature;

//vytvoří proměnou s nejvyšší hodnotou clusteru
var maxCluster = Math.max.apply(Math, obeti.map(function(o) {return o.properties.cluster;}));

//vytvoří skupinu s vrstvou obeti bez klastrů
var vrstvaObeti = L.geoJSON(obeti.filter(obet=>obet.properties.cluster===0), {
    onEachFeature: onEachFeature,
    iconUrl: 'leaf-green.png',
});
var obetiGroup = L.layerGroup([vrstvaObeti]);
obetiGroup.addTo(mymap);

//vytvoří skupinu s vrstvou obeti v klastrech
var i;
var obetiGroupCluster = [];
for(i=1; i<=maxCluster; i++) {
    var vrstvaObeti = L.geoJSON((obeti.filter(obet=>obet.properties.cluster===i)), {
        onEachFeature: onEachFeature,
    });
    var markers = L.markerClusterGroup();
    markers.addLayer(vrstvaObeti);
    obetiGroupCluster.push(L.layerGroup([markers]));
    obetiGroupCluster[i-1].addTo(mymap);

    //zoomuje na vybraný klaster
    markers.on('clusterclick', function (a) {
        a.layer.zoomToBounds({padding: [20, 20]});
    });
};

//filtrovací parametry
var vekOdValue = 2;
var vekDoValue = 91;
var datumOdValue = 1;
var datumDoValue = 365;

var muziValue = 1;
var zenyValue = 1;
var ceskaValue = 1;
var slovenskaValue = 1;
var madarskaValue = 1;
var neurcenaNarodnostValue = 1;
var zastreleniValue = 1;
var nehodaValue = 1;
var jinyZpusobValue = 1;
var protestValue = 1;
var nahodaValue = 1;
var neurcenaOkolnostValue = 1;

//filtorvací funkce
var filterObeti = function (){
    //vymaže všechny vrstvy ze skupin (krome basemapy)
    mymap.eachLayer(function (layer) {
        obetiGroup.removeLayer(layer);
    });
    for(i=1; i<=maxCluster; i++) {  
        mymap.eachLayer(function (layer) {
            obetiGroupCluster[i-1].removeLayer(layer);
        });
    };
    
    //resetuje předchozí filtry
    obeti = [];
    var obetiCache = geojsonFeature;
    var filterChache = [];

    //filtr pohlavy
    if (muziValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.pohlavi==="0");
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (zenyValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.pohlavi==="1");
        filterChache.forEach(element => {
            obeti.push(element)
        });
    }
    
    obetiCache = obeti;
    obeti = [];
    
    //filtr narodnost
    if (ceskaValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.narodnost===1);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (slovenskaValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.narodnost===2);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (madarskaValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.narodnost===3);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (neurcenaNarodnostValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.narodnost===0);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    }

    //filtr veku
    obeti = obeti.filter(obet=>obet.properties.vek>=vekOdValue);
    obeti = obeti.filter(obet=>obet.properties.vek<=vekDoValue);

    obetiCache = obeti;
    obeti = [];

    //filtr zpusobu usmrceni
    if (nehodaValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.zpusobUsmrceniKod===1);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (zastreleniValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.zpusobUsmrceniKod===2);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (jinyZpusobValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.zpusobUsmrceniKod===3);
        filterChache.forEach(element => {
            obeti.push(element)
        });
        filterChache = obetiCache.filter(obet=>obet.properties.zpusobUsmrceniKod===4);
        filterChache.forEach(element => {
            obeti.push(element)
        });
        filterChache = obetiCache.filter(obet=>obet.properties.zpusobUsmrceniKod===0);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    }

    obetiCache = obeti;
    obeti = [];

    //filtr okolnosti
    if (protestValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.okolnostiUsmrceni===2);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (nahodaValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.okolnostiUsmrceni===1);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    } if (neurcenaOkolnostValue == 1) {
        filterChache = obetiCache.filter(obet=>obet.properties.okolnostiUsmrceni===0);
        filterChache.forEach(element => {
            obeti.push(element)
        });
    }

    //filtr datum
    obeti = obeti.filter(obet=>obet.properties.datumIncidentuJS>=datumOdValue);
    obeti = obeti.filter(obet=>obet.properties.datumIncidentuJS<=datumDoValue);

    //přidá filtrovanou vrstvu obeti bez klastru
    var vrstvaObeti = L.geoJSON(obeti.filter(obet=>obet.properties.cluster===0), {
        onEachFeature: onEachFeature,
    });
    obetiGroup.addLayer(vrstvaObeti);

    //přidá filtrovanou vrstvu obeti s klastry
    for(i=1; i<=maxCluster; i++) { 
        var vrstvaObeti = L.geoJSON(obeti.filter(obet=>obet.properties.cluster===i), {
            onEachFeature: onEachFeature,
        });
        var markers = L.markerClusterGroup();
        markers.addLayer(vrstvaObeti);
        obetiGroup.addLayer(markers);

        //zoomuje na vybraný klaster
        markers.on('clusterclick', function (a) {
            a.layer.zoomToBounds({padding: [20, 20]});
        });
    };

    //upraví počet obětí
    document.getElementById("pocet-obeti").innerHTML = "<p><strong>Počet obětí: " + obeti.length + "</strong></p>";
};

//ovládání tlačítek
$("#muzi").click(function(){
    if (muziValue == 1) {
        muziValue = 0;
    } else {
        muziValue = 1;
    }
    filterObeti();
    $("#muzi").toggleClass("aktivni");
});

$("#zeny").click(function(){
    if (zenyValue == 1) {
        zenyValue = 0;
    } else {
        zenyValue = 1;
    }
    filterObeti();
    $("#zeny").toggleClass("aktivni");
});

$("#ceska").click(function(){
    if (ceskaValue == 1) {
        ceskaValue = 0;
    } else {
        ceskaValue = 1;
    }
    filterObeti();
    $("#ceska").toggleClass("aktivni");
});

$("#slovenska").click(function(){
    if (slovenskaValue == 1) {
        slovenskaValue = 0;
    } else {
        slovenskaValue = 1;
    }
    filterObeti();
    $("#slovenska").toggleClass("aktivni");
});

$("#madarska").click(function(){
    if (madarskaValue == 1) {
        madarskaValue = 0;
    } else {
        madarskaValue = 1;
    }
    filterObeti();
    $("#madarska").toggleClass("aktivni");
});

$("#neurcenanarodnost").click(function(){
    if (neurcenaNarodnostValue == 1) {
        neurcenaNarodnostValue = 0;
    } else {
        neurcenaNarodnostValue = 1;
    }
    filterObeti();
    $("#neurcenanarodnost").toggleClass("aktivni");
});

$("#nehoda").click(function(){
    if (nehodaValue == 1) {
        nehodaValue = 0;
    } else {
        nehodaValue = 1;
    }
    filterObeti();
    $("#nehoda").toggleClass("aktivni");
});

$("#zastreleni").click(function(){
    if (zastreleniValue == 1) {
        zastreleniValue = 0;
    } else {
        zastreleniValue = 1;
    }
    filterObeti();
    $("#zastreleni").toggleClass("aktivni");
});

$("#jinyzpusob").click(function(){
    if (jinyZpusobValue == 1) {
        jinyZpusobValue = 0;
    } else {
        jinyZpusobValue = 1;
    }
    filterObeti();
    $("#jinyzpusob").toggleClass("aktivni");
});

$("#protest").click(function(){
    if (protestValue == 1) {
        protestValue = 0;
    } else {
        protestValue = 1;
    }
    filterObeti();
    $("#protest").toggleClass("aktivni");
});

$("#nahoda").click(function(){
    if (nahodaValue == 1) {
        nahodaValue = 0;
    } else {
        nahodaValue = 1;
    }
    filterObeti();
    $("#nahoda").toggleClass("aktivni");
});

$("#neurcenaokolnost").click(function(){
    if (neurcenaOkolnostValue == 1) {
        neurcenaOkolnostValue = 0;
    } else {
        neurcenaOkolnostValue = 1;
    }
    filterObeti();
    $("#neurcenaokolnost").toggleClass("aktivni");
});

$("#slider-vek").slider({
    range: true,
    min: 0,
    max: 100,
    values: [ 2, 91 ],
    slide: function( event, ui ) {
        $("#vekOd").val("od " + ui.values[ 0 ] + " let");
        $("#vekDo").val("do " + ui.values[ 1 ] + " let");
    },
    change: function(event, ui) {
        vekOdValue = $("#slider-vek").slider("values", 0);
        vekDoValue = $("#slider-vek").slider("values", 1);
        filterObeti();
    }
});
$("#vekOd").val("od " + $("#slider-vek").slider("values", 0) + " let");
$("#vekDo").val("do " + $("#slider-vek").slider("values", 1) + " let");

$("#slider-datum").slider({
    range: true,
    min: 1,
    max: 365,
    values: [1, 365],
    slide: function( event, ui ) {
        $("#datumOd").val("od " + kalendar.filter(den=>den.id==ui.values[0])[0]["datum"]);
        $("#datumDo").val("do " + kalendar.filter(den=>den.id==ui.values[1])[0]["datum"]);
    },
    change: function(event, ui) {
        datumOdValue = $("#slider-datum").slider("values", 0);
        datumDoValue = $("#slider-datum").slider("values", 1);
        filterObeti();
    }
});
$("#datumOd").val("od " + kalendar.filter(den=>den.id==$("#slider-datum").slider("values", 0))[0]["datum"]);
$("#datumDo").val("do " + kalendar.filter(den=>den.id==$("#slider-datum").slider("values", 1))[0]["datum"]);

document.getElementById("pocet-obeti").innerHTML = "<p><strong>Počet obětí: " + obeti.length + "</strong></p>";

$("#reset").click(function(){
    muziValue = 1;
    zenyValue = 1;
    ceskaValue = 1;
    slovenskaValue = 1;
    madarskaValue = 1;
    neurcenaNarodnostValue = 1;
    zastreleniValue = 1;
    nehodaValue = 1;
    jinyZpusobValue = 1;
    protestValue = 1;
    nahodaValue = 1;
    neurcenaOkolnostValue = 1;
    $("#slider-vek").slider({values: [2, 91],});
    $("#slider-datum").slider({values: [1, 365],});
    filterObeti();

    $("button").removeClass("aktivni");
    $("#muzi").addClass("aktivni");
    $("#zeny").addClass("aktivni");
    $("#ceska").addClass("aktivni");
    $("#slovenska").addClass("aktivni");
    $("#madarska").addClass("aktivni");
    $("#neurcenanarodnost").addClass("aktivni");
    $("#nehoda").addClass("aktivni");
    $("#zastreleni").addClass("aktivni");
    $("#jinyzpusob").addClass("aktivni");
    $("#vsechnyokolnosti").addClass("aktivni");
    $("#protest").addClass("aktivni");
    $("#nahoda").addClass("aktivni");
    $("#neurcenaokolnost").addClass("aktivni");
    $("#vekOd").val("od " + $("#slider-vek").slider("values", 0) + " let");
    $("#vekDo").val("do " + $("#slider-vek").slider("values", 1) + " let");
    $("#datumOd").val("od " + kalendar.filter(den=>den.id==$("#slider-datum").slider("values", 0))[0]["datum"]);
    $("#datumDo").val("do " + kalendar.filter(den=>den.id==$("#slider-datum").slider("values", 1))[0]["datum"]);
});

//zpruhledni sidetab
$(".sidebartab").click(function(){
    if(window.innerWidth>768) {
        if(!$(this).hasClass("active") && !$("#infotab").hasClass("active")) {
            setTimeout(function(){$(".sidebar-tabs").removeClass("otevrene")}, 500);
        } if($(this).hasClass("active")) {
            $(".sidebar-tabs").addClass("otevrene");
        }
    } else {
        if(!$(this).hasClass("active") && !$("#infotab").hasClass("active")) {
            $(".sidebar-tabs").removeClass("otevrene");
        } if($(this).hasClass("active")) {
            $(".sidebar-tabs").addClass("otevrene");
        }
    }                
})

//zavře sidebar po kliknuti na mapu v mobilní verzi
$("#mapa").click(function() {
    if(window.innerWidth<=768) {
        sidebar.close();
        $(".sidebar-tabs").removeClass("otevrene");
    }
})

//v mobilni verzi prida do sidebaru zavitaci krizek
$(".fa-times").click(function(){
    sidebar.close();
    $(".sidebar-tabs").removeClass("otevrene");
})
