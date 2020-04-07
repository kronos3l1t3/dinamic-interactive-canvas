var objetos = {
    0:
        {
            "name":"Pinar", "img":"pinar", "ptox":"159", "ptoy":"53",
            "ptos":{
                0:{"ptox":"43", "ptoy":"112"},
                1:{"ptox":"75", "ptoy":"79"},
                2:{"ptox":"100", "ptoy":"134"},
                3:{"ptox":"157", "ptoy":"37"},
                4:{"ptox":"172", "ptoy":"41"},
                5:{"ptox":"174", "ptoy":"53"},
                6:{"ptox":"178", "ptoy":"57"},
                7:{"ptox":"176", "ptoy":"64"},
                8:{"ptox":"153", "ptoy":"80"},
                9:{"ptox":"147", "ptoy":"91"},
                10:{"ptox":"123", "ptoy":"91"},
                11:{"ptox":"102", "ptoy":"95"},
                12:{"ptox":"99", "ptoy":"106"},
                13:{"ptox":"70", "ptoy":"123"},
                14:{"ptox":"46", "ptoy":"118"},
            }
        },
    1:
        {
            "name":"Artemisa", "img":"artemisa", "ptox":"203", "ptoy":"2013",
            "tipo":"rectangulo", "ladox":"12", "ladoy":"12",
        },
    2:
        {
            "name":"Mayabeque", "img":"mayabeque", "ptox":"252", "ptoy":"209",
            "tipo":"rectangulo", "ladox":"12", "ladoy":"12",
        },
    3:
        {
            "name":"Habana", "img":"habana", "ptox":"291", "ptoy":"205",
            "tipo":"circulo", "radio":"8",
        },
    4:{
        "name":"Matanzas", "img":"matanzas", "ptox":"309", "ptoy":"230",
        "tipo":"rectangulo", "ladox":"42","ladoy":"43",
    },
    5:{
        "name":"Matanzas", "img":"matanzas", "ptox":"393", "ptoy":"235",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    6:{
        "name":"Matanzas", "img":"matanzas", "ptox":"361", "ptoy":"249",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    7:{
        "name":"Matanzas", "img":"matanzas", "ptox":"439", "ptoy":"279",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    8:{
        "name":"Matanzas", "img":"matanzas", "ptox":"487", "ptoy":"282",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    "9":{
        "name":"Matanzas", "img":"matanzas", "ptox":"543", "ptoy":"322",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    "10":{
        "name":"Matanzas", "img":"matanzas", "ptox":"607", "ptoy":"347",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    11:{
        "name":"Matanzas", "img":"matanzas", "ptox":"673", "ptoy":"363",
        "tipo":"rectangulo","ladox":"42", "ladoy":"43",
    },
    12:{
        "name":"Matanzas", "img":"matanzas", "ptox":"619", "ptoy":"396",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    13:{
        "name":"Matanzas", "img":"matanzas", "ptox":"685", "ptoy":"404",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    14:{
        "name":"Matanzas", "img":"matanzas", "ptox":"752", "ptoy":"402",
        "tipo":"rectangulo", "ladox":"42", "ladoy":"43",
    },
    15:{
        "name":"Matanzas", "img":"matanzas","ptox":"194", "ptoy":"296",
        "tipo":"rectangulo","ladox":"42", "ladoy":"43",
    },
};

(function() {
    'use strict';
    window.addEventListener('load', init, false);
    var canvas = null, ctx = null;
    var lastPress = null;
    var mousex = 0, mousey = 0;
    var scaleX = null;
    var scaleY = null;
    var rect = null;

    var img = new Image();
    var img_variable = "web/img/cuba/objeto.png";
    img.src = img_variable.replace("objeto",objetos[4].img);


    window.addEventListener("resize", function(){
        rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width;
        scaleY = canvas.height / rect.height;
    }, false);

    function init() {
        canvas = document.getElementById('mapa_canva');
        ctx = canvas.getContext('2d');
        rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width;
        scaleY = canvas.height / rect.height;
        enableInputs();
        run();
    }

    function run() {
        paint(ctx);
    }

    function paint(ctx) {
        canvas.width = canvas.width;
        ctx.drawImage(img, 0, 0,canvas.width-5, canvas.height-50);
        lastPress = null;
    }

    function enableInputs() {
        //actualizando y el puntero
        canvas.addEventListener('mousemove', function (evt) {
            var rect = canvas.getBoundingClientRect();
            mousex = (evt.clientX - rect.left)*scaleX;
            mousey = (evt.clientY - rect.top)*scaleY;
        }, false);

        //actualizando la imagen
        canvas.addEventListener('click', function (evt) {
            //console.log(mousex+":"+mousey);
            objeto_mas_cercano(mousex, mousey);
            lastPress = evt.which;
        }, false);
    }

    function objeto_mas_cercano(pto1x, pto1y){
        var objeto_pos = parseInt(pto_mas_cercano(pto1x, pto1y, objetos));
        if(pertenece_figura(pto1x, pto1y, objeto_pos) == true){
            img.src=img_variable.replace("objeto",objetos[objeto_pos].img);
            window.setTimeout(run, 25);
        };
    }

    function pertenece_figura(pto1x, pto1y, objeto_pos){
        //Punto dentro de la figura
        var ptoP = {
            "ptox":pto1x,
            "ptoy":pto1y
        }

        var punto_final = ultimo_punto(objeto_pos);
        var ptos_figura = JSON.parse(JSON.stringify(objetos[objeto_pos].ptos));
        for (var punto in objetos[objeto_pos].ptos){
            if (punto_final != punto){
                var pto_intercepcion = pto_rectas_cruzadas(objeto_pos, objetos[objeto_pos].ptos[parseInt(punto)], objetos[objeto_pos].ptos[parseInt(punto)+1], ptoP);

                if (
                    entre_ptos(pto_intercepcion, objetos[objeto_pos].ptos[parseInt(punto)], objetos[objeto_pos].ptos[parseInt(punto)+1]) == true &&
                    (distancia_entre_ptos(objetos[objeto_pos].ptox,objetos[objeto_pos].ptoy,ptoP.ptox,ptoP.ptoy) <
                    distancia_entre_ptos(objetos[objeto_pos].ptox,objetos[objeto_pos].ptoy,pto_intercepcion.ptox, pto_intercepcion.ptoy))
                ){
                    return true;
                }
            }else{return false;}
        }
    }

    function entre_ptos(pto1, pto2, pto3){
        if (
            pto2.ptoy <= pto1.ptoy &&
            pto3.ptoy >= pto1.ptoy &&
            pto2.ptox <= pto1.ptox &&
            pto3.ptox >= pto1.ptox
        ){
            return true;
        }else if(
            pto2.ptoy >= pto1.ptoy &&
            pto3.ptoy <= pto1.ptoy &&
            pto2.ptox <= pto1.ptox &&
            pto3.ptox >= pto1.ptox
        ){
            return true;
        }else if(
            pto2.ptoy >= pto1.ptoy &&
            pto3.ptoy <= pto1.ptoy &&
            pto2.ptox >= pto1.ptox &&
            pto3.ptox <= pto1.ptox
        ){
            return true;
        }else if(
            pto2.ptoy <= pto1.ptoy &&
            pto3.ptoy >= pto1.ptoy &&
            pto2.ptox >= pto1.ptox &&
            pto3.ptox <= pto1.ptox
        ){
            return true;
        }else{
            return false;
        }
    }

    function pto_mas_cercano(ptox, ptoy, pto_arreglo){
        var distancia = 100000;
        var cateto_a = 0;
        var cateto_b = 0;
        var hipotenusa = 0;
        var pto_posicion = null;

        for (var i in pto_arreglo){
            hipotenusa = distancia_entre_ptos(ptox, ptoy, pto_arreglo[i].ptox, pto_arreglo[i].ptoy);
            if (distancia > hipotenusa){
                distancia = hipotenusa;
                pto_posicion = i;
            }
        }
        return pto_posicion;
    }

    function distancia_entre_ptos(ptox1, ptoy1, ptox2, ptoy2){
        var cateto_a = ptox1-ptox2;
        var cateto_b = ptoy1-ptoy2;
        return Math.sqrt(Math.pow(cateto_a, 2)+Math.pow(cateto_b, 2));
    }

    function ultimo_punto(objeto_pos){
        var i = 0;
        for (i in objetos[objeto_pos].ptos){
        }
        return i;
    }

    function obtener_recta(ptoA,ptoB){
        //variables de la primera recta
        var x11 = parseFloat(ptoA.ptox);
        var x12 = parseFloat(ptoB.ptox);
        var y11 = parseFloat(ptoA.ptoy);
        var y12 = parseFloat(ptoB.ptoy);
        //pendiente de la primera recta
        var pendiente1 = (y12 - y11)/(x12 - x11);
        //n de la primera recta
        var n1 = ptoB.ptoy - (pendiente1*ptoB.ptox);
        var recta = {
            "pendiente":pendiente1,
            "n":n1,
        }
        return recta;
    }

    function pto_rectas_cruzadas(objeto_pos, pto1_cercano, pto2_cercano, ptoP){
        //obteniendo primera recta
        var recta1 = obtener_recta(objetos[objeto_pos], ptoP);

        //obteniendo segunda recta
        var recta2 = obtener_recta(pto1_cercano, pto2_cercano);
        //obteniendo punto de interseccion

        var pto_intercepcion = {
            "ptox": (recta2.n-recta1.n)/(recta2.pendiente-recta1.pendiente)
        };
        if (Math.sign(pto_intercepcion.ptox) == -1){
            pto_intercepcion.ptox = -pto_intercepcion.ptox
        };
        pto_intercepcion.ptoy = (recta2.pendiente*pto_intercepcion.ptox)+recta2.n;
        return pto_intercepcion;
    }
})();