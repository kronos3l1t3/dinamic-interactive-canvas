//Arreglo de elementos
var elements_array = {};

//Objeto y propiedades de los elementos
var elements_properties = {
    name:null,
    img:null,
    ptox:0,
    ptoy:0,
    ptos:{},
    height:0,
    width:0,
    visibility:true,
    event:{},
    html: "<div><table>" +
        "<tr><td><label for='name'>Nombre: </label></td><td><input id = 'name' name = 'name' type = 'text'/></td></tr>" +
        "<tr><td><label for='img'>Imagen: </label></td><td><input id = 'img' name = 'img' type='file' style='color: transparent' /></td></tr>" +
        "<tr><td><label for='ptox'>PtoX: </label></td><td><input id = 'ptox' name = 'ptox' type='text'/></td></tr>" +
        "<tr><td><label for='ptoy'>PtoY: </label></td><td><input id = 'ptoy' name = 'ptoy' type='text'/></td></tr>" +
        "<tr><td><label for='ptos'>Vectores: </label></td><td><input id = 'ptos' name = 'ptos' type='text'/></td></tr>" +
        "<tr><td><label for='img'>Altura: </label></td><td><input id = 'height' name = 'height' type='text'/></td></tr>" +
        "<tr><td><label for='width'>Ancho: </label></td><td><input id = 'width' name = 'width' type='text'/></td></tr>" +
        "<tr><td><label for='visibility'>Visible: </label></td><td><input id = 'visibility' name = 'visibility' type='checkbox' checked/></td></tr>" +
        "<tr><td><label for='event'>Eventos: </label></td><td><input id = 'event' name = 'event' type='text'/></td></tr>" +
        "<tr><td><input id = 'save' name = 'save' type='button' value='Guardar'/></td><td><input id = 'show' name = 'show' type='button' value='Visualizar'/></td></tr>" +
        "</table></div>"
}

// ++++Crud de objetos JSON++++


// Crear elemento dentro del select "Vista"
function create_element(){
    var object_name = window.prompt("Escriba un nombre para el nuevo elemento");
    if (object_name != null){
        var elements_variable = _g("#elements");
        var node = document.createElement("option");    // Create a <option> node
        var textnode = document.createTextNode(object_name);     // Create a text node
        node.id = elements_variable.childElementCount;           // Insertando id en el option
        elements_properties.name = object_name;
        elements_array[node.id] = clone(elements_properties);
        node.appendChild(textnode);
        elements_variable.appendChild(node);
    }

};

// Mostrar un elemento del arreglo
function edit_element(){
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    var properties = _g("#properties");
    properties.innerHTML = object.html;
    //addE('#save',)
};

// Eliminar un elemento del arreglo
function delete_element(){
    var select = _g("#elements");
    select.remove(select.selectedIndex);
};

// Mostrar un elemento del arreglo
function show_element(){

};

// ----Fin de Crud de Objetos JSON----

// Creando propiedades
function create_props() {
    var props = _get('#properties');
}

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
    console.log(_g('#elements').value);
}

async function add_event_handler(){
    addE('#create','click',create_element);
    addE('#edit','click',edit_element);
    addE('#remove','click',delete_element);
    addE('#elements','change',selector);
}

(async function(){
    'use strict';
    var lienzo = _g('#canvas');
    var canvas = lienzo.getContext('2d');
    var foot = _g('#edit_canvas');
    foot.innerHTML = "<div>" +
        "<select id='elements'><option id = 0>canvas</option></select>" +
        "<input value='Crear' id = 'create' type='button'/>" +
        "<input value='Editar' id = 'edit' type='button'/>" +
        "<input value='Remover' id = 'remove' type='button'/></div><br>" +
        "<div id = 'properties'></div>";
    elements_properties.name = 'canvas';
    elements_properties.height = 640;
    elements_properties.width = 480;
    elements_array [0] = clone(elements_properties);
    add_event_handler();
    edit_element();
})();

