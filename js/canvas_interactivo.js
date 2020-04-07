var lienzo = _g('#canvas');
var canvas = lienzo.getContext('2d');

lienzo.width = 640;
lienzo.height = 480;
lienzo.tabIndex = 0;
lienzo.style = "border: 1px solid black";

var mousex = 0, mousey = 0;
var scaleX = null;
var scaleY = null;
var rect = null;

var props = _g('#edit_canvas');
//Arreglo de elementos
var elements_array = {};

//Objeto y propiedades de los elementos
var elements_properties = {
    name:null,
    img:null,
    img_pos:{
        img_ptox:0,
        img_ptoy:0,
    },
    ptox:0,
    ptoy:0,
    ptos:{},
    height:0,
    width:0,
    visibility:true,
    event:{},
}



// ++++Crud de objetos JSON++++

// Crear elemento dentro del select "Vista"
function create_element(){
    var object_name = window.prompt("Escriba un nombre para el nuevo elemento");
    if (object_name != null){
        var elements_variable = _g("#elements");
        var node = document.createElement("option");    // Create a <option> node
        var textnode = document.createTextNode(object_name);     // Create a text node
        node.id = elements_variable.childElementCount;
        var object = clone(elements_properties);
        object.name = object_name;
        elements_array[node.id] = object;
        node.appendChild(textnode);
        elements_variable.appendChild(node);
    }

};

// Mostrar un elemento del arreglo
function edit_element(){
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    var properties = _g("#properties");
    var html = "<div><table>" +
        "<tr><td><label for='name'>Nombre: </label></td><td><input id = 'name' name = 'name' type = 'text' value = '"+object.name+"'/></td></tr>" +
        "<tr><td><label for='img'>Imagen: </label></td><td><input id = 'img' name = 'img' type='file' value = '"+object.img+"' style='color: transparent' /></td></tr>" +
        "<tr><td><label for='img_ptox'>Posicion x: </label></td><td><input id = 'img_ptox' name = 'img_ptox' type='text' value = '"+object.ptox+"' /></td></tr>" +
        "<tr><td><label for='img_ptoy'>Posicion y: </label></td><td><input id = 'img_ptoy' name = 'img_ptoy' type='text' value = '"+object.ptox+"' /></td></tr>" +
        "<tr><td colspan='2'><label>Centro de la imagen: </label></td></tr>" +
        "<tr><td><label for='ptox'>PtoX: </label></td><td><input id = 'ptox' name = 'ptox' type='text' value = '"+object.ptox+"' /></td></tr>" +
        "<tr><td><label for='ptoy'>PtoY: </label></td><td><input id = 'ptoy' name = 'ptoy' type='text' value = '"+object.ptoy+"' /></td></tr>" +
        "<tr><td><label for='ptos'>Vectores: </label></td><td><input id = 'ptos' name = 'ptos' type='text' value = '"+JSON.stringify(object.ptos)+"'/></td></tr>" +
        "<tr><td><label for='height'>Altura: </label></td><td><input id = 'width' name = 'width' type='text' value = '"+object.height+"'/></td></tr>" +
        "<tr><td><label for='width'>Ancho: </label></td><td><input id = 'height' name = 'height' type='text' value = '"+object.width+"'/></td></tr>" +
        "<tr><td><label for='visibility'>Visible: </label></td><td><input id = 'visibility' name = 'visibility' type='checkbox' "+((object.visibility == true)?'checked':'')+"/></td></tr>" +
        "<tr><td><label for='event'>Eventos: </label></td><td><input id = 'event' name = 'event' type='text' value = '"+object.event+"' /></td></tr>" +
        "<tr align='center'>" +
            "<td><input id = 'save' name = 'save' type='button' value='Guardar'/></td>" +
            "<td><input id = 'show' name = 'show' type='button' value='Visualizar'/></td>" +
        "</tr></table></div>";
    properties.innerHTML = html;
    addE('#save','click',save_props);
    addE('#show','click',show_elment);
};

// Eliminar un elemento del arreglo
function delete_element(){
    var select = _g("#elements");
    select.remove(select.selectedIndex);
};

// Mostrar un elemento del arreglo
function show_elment(){
    var select = _g("#elements");
    if(elements_array[select.selectedIndex].img != null){
        var img = new Image();
        img.src = elements_array[select.selectedIndex].img;
        canvas.drawImage(
            img,
            elements_array[select.selectedIndex].img_pos.img_ptox,
            elements_array[select.selectedIndex].img_pos.img_ptox,
            parseInt(elements_array[select.selectedIndex].height)-10,
            parseInt(elements_array[select.selectedIndex].width)-10
        );
    }else{
        console.log("status: 400, img not found");
        //return error status 400 img not found
    }
};


// ----Fin de Crud de Objetos JSON----

//++++++++ Otras funcionalidades ++++++++++

// Salvar configuracion de los elementos

function save_props(){
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    object.name = _g("#name").value;
    object.img = _g("#img").value.replace('C:\\fakepath\\','img/');
    object.img_pos.img_ptox = _g("#img_ptox").value;
    object.img_pos.img_ptoy = _g("#img_ptoy").value;
    object.ptox = _g("#ptox").value;
    object.ptoy = _g("#ptoy").value;
    object.ptos = _g("#ptos").value;
    object.height = _g("#height").value;
    object.width = _g("#width").value;
    object.visibility = _g("#visibility").value;
    object.event = _g("#event").value;
    if(select.selectedIndex == 0){
        lienzo.width = parseInt(object.height)+5;
        lienzo.height = parseInt(object.width)+5;
    }
};


//Contar elementos de objetos
function elements_count(){
    var counter = 0;
    for (element in elements_array){
        counter += 1;
    }
    return counter;
};

//Obtener elemento por id remplazar si es necesario por JQUERY
function _g(object){

    if(object.indexOf('#') != -1){ // Return elements by id
        return document.getElementById(object.replace('#',''));
    }else if(object.indexOf('+') != -1){ // Return elements by Tag
        return document.getElementsByTagName(object.replace('+',''));
    }else if(object.indexOf('.') != -1){ // Return elements by Class
        return document.getElementsByClassName(object.replace('.',''));
    }
};

//Adicionar un evento a un boton
function addE(id, event, fun){
    _g(id).addEventListener(event,function(){
        fun();
    });
};

//Clonar objeto JSON
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};

function selector(){
    edit_element();
}

async function add_event_handler(){
    addE('#create','click',create_element);
    addE('#edit','click',edit_element);
    addE('#remove','click',delete_element);
    addE('#elements','change',selector);
}

(async function(){
    'use strict';
    props.innerHTML = "<div>" +
        "<select id='elements'><option id = 0>canvas</option></select>" +
        "<input value='Crear' id = 'create' type='button'/>" +
        "<input value='Editar' id = 'edit' type='button'/>" +
        "<input value='Remover' id = 'remove' type='button'/></div><br>" +
        "<div id = 'properties'></div>";

    var object = clone(elements_properties);
    object.name = 'canvas';
    object.width = 640;
    object.height = 480;

    elements_array [0] = object;
    add_event_handler();
    edit_element();

})();

