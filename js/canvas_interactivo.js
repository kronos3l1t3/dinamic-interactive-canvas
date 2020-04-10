// ++++++++ Variables del Sistema +++++++++

var lienzo = _g('#canvas');
var canvas = lienzo.getContext('2d');

lienzo.width = 700;
lienzo.height = 420;
lienzo.tabIndex = 0;
lienzo.style = "border: 1px solid black";
var time = null;

var mousex = 0, mousey = 0;
rect = lienzo.getBoundingClientRect();
scaleX = lienzo.width / rect.width;
scaleY = lienzo.height / rect.height;

var props = _g('#edit_canvas');
//Arreglo de elementos
var elements_array = {};

//Objeto y propiedades de los elementos
var elements_properties = {
    name:null,
    img:null,
    img_ptox: 0,
    img_ptoy: 0,
    height:0,
    width:0,
    visibility:true,
    shapes:{},
    events:{},
}

var shape = {
    name:null,
    shape_points:{}
}
//Figuras dentro del objeto
var shape_point = {
    x:null,
    y:null
}

var events_type = {
    0:'click',
    1:'change',
    2:'mouseover',
    3:'keypress',
    4:'keydown',
    5:'keyup'
}

var actions = {
    0:{
        name:'scale',
        element_id:null,
        _do: function(){

        }
    },
    1:{
        name:'move_to',
        element_id:null,
        _do: function () {

        }
    },
    2:{
        name:'toogle_show',
        element_id:null,
        _do: function () {

        }
    },
    3:{
        name:'text_show',
        element_id:null,
        _do: function () {

        }
    }
}
// -------- Fin Variables del Sistema ----------

// ++++Crud de objetos JSON++++

// Crear elemento imagenes
function create_element(){
    var object_name = window.prompt("Escriba un nombre para el nuevo elemento");
    if (object_name != null){
        var elements_variable = _g("#elements");
        var node = document.createElement("option");    // Create a <option> node
        var textnode = document.createTextNode(object_name);     // Create a text node
        var object = clone(elements_properties);
        node.id = elements_variable.childElementCount;
        object.name = object_name;
        elements_array[node.id] = object;
        node.appendChild(textnode);
        elements_variable.appendChild(node);
        elements_variable.selectedIndex = node.id;
    }
    edit_element();
};

// Mostrar un elemento del arreglo
function edit_element(){
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    var properties = _g("#properties");
    var html = "<div style='visibility: visible; width: 30%; float: left;'><table>" +
        "<tr><td><label for='name'>Nombre: </label></td>" +
        "<td><input id = 'name' name = 'name' type = 'text' value = '"+object.name+"' "+((object.name=='canvas')?'readonly':'')+"/></td></tr>" +
        "<tr><td><label for='img'>Imagen: </label></td>" +
        "<td><input id = 'img' name = 'img' type='file' value = '"+object.img+"' style='color: transparent' /></td></tr>" +
        "<tr><td><label >Posicion (x;y): </label></td>" +
        "<td><input id = 'img_ptox' name = 'img_ptox' type='text' size='1%' value = '"+object.img_ptox+"' />" +
        "<input id = 'img_ptoy' name = 'img_ptoy' type='text' size='1%' value = '"+object.img_ptoy+"' />" +
        "<label for='check_point' > Marcar</label><input id = 'check_point' name = 'check_point' type = 'checkbox' /></td></tr>" +
        "<tr><td><label for='height'>Altura: </label></td>" +
        "<td><input id = 'width' name = 'width' type='text' value = '"+object.width+"'/></td></tr>" +
        "<tr><td><label for='width'>Ancho: </label></td>" +
        "<td><input id = 'height' name = 'height' type='text' value = '"+object.height+"'/></td></tr>" +
        "<tr><td><label for='visibility'>Visible: </label></td>" +
        "<td><input id = 'visibility' name = 'visibility' type='checkbox' "+((object.visibility == true)?'checked':'')+"/></td></tr>" +
        "<tr><td><label for='ptos'>Figuras: </label></td>" +
        "<td><input id = 'shapes' name = 'shapes' type='text' value = '"+JSON.stringify(object.shapes)+"' size='12%'/>" +
        "<input type='button' id = 'open_shapes' name = 'open_shapes' value='Abrir'/></td></tr>" +
        "<tr><td><label for='event'>Eventos: </label></td>" +
        "<td><input id = 'events' name = 'events' type='text' value = '"+JSON.stringify(object.events)+"' size='12%'/>" +
        "<input type='button' id = 'open_events' name = 'open_events' value='Abrir'/></td></tr>" +
        "</table></div>" +
        "<div style='visibility: hidden;' id='sub_properties'>" +
        "</div>";
    properties.innerHTML = html;
    save();
    show_elments();
};

// Eliminar un elemento del arreglo
function delete_element(){
    var select = _g("#elements");
    if(select.value != 'canvas') {
        delete elements_array[select.selectedIndex];
        select.remove(select.selectedIndex);
    }else alert('No es posible eliminar el canvas');
    edit_element();
};

// Mostrar todos los elementos del arreglo
async function show_elments(){
    canvas.clearRect(0,0,lienzo.width, lienzo.height);
    for (element in elements_array){
        if(elements_array[element].img != null && elements_array[element].visibility == true){
            var img = new Image();
            img.src = elements_array[element].img;
            canvas.drawImage(
                img,
                elements_array[element].img_ptox,
                elements_array[element].img_ptoy,
                parseInt(elements_array[element].height),
                parseInt(elements_array[element].width)
            );
        }
    }
};

// ----Fin de Crud de Objetos JSON----

//++++++++ Otras funcionalidades ++++++++++

// Salvar configuracion de los elementos

function save_props(id_name){
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    switch (id_name) {
        case 'img':
            var sentence = "object."+id_name+" = "+"'img/object/"+_g("#"+id_name).value.replace("C:\\fakepath\\","")+"'";
            break;
        case 'visibility':
            var sentence = "object."+id_name+" = "+_g("#"+id_name).checked;
            break;
        default:
            var sentence = "object."+id_name+" = "+_g("#"+id_name).value;
            break;
    }
    eval(sentence);
    if(select.selectedIndex == 0){
        lienzo.width = parseInt(object.height);
        lienzo.height = parseInt(object.width);
    }
    if(id_name='name') {
        select.value = object.name;
    };
    show_elments();
    setTimeout(show_elments,25);
};

function draw_line(ptox1,ptoy1,ptox2,ptoy2) {
    canvas.moveTo(ptox1, ptoy1);
    canvas.lineTo(ptox2, ptoy2);
    canvas.stroke();
}

function open_subproperties(object){
    var sub_properties = _g('#sub_properties');
    var select = _g('#elements');

    sub_properties.innerHTML = "Figuras: <br>" +
        "<div style='display: inline-block;'>" +
            "<input type='button' id='close_subproperties' name = 'close_subproperties' value='&times' title=\"Cerrar\"/>";
    switch (object) {
        case 'open_shapes':
            sub_properties.innerHTML +=
                "<input align='right' type='button' value='+' id='add_shape' name='add_shape' title=\"Adicionar Figura\" />" +
                "<input align='right' type='button' value='-' id='remove_shape' name='remove_shape' title=\"Eliminar Figura\" />" +
                "<select style='visibility: hidden' id='select_shape' name='select_shape'></select></div>" +
                "<table id='shape_table'></table>";
            shapes_select();
            show_shape();
            break;
        case 'open_events':
            break;
    }

    sub_properties.style = "visibility: visible; float: left; margin-top: 0.4%; width: 20%;";
    addE('#close_subproperties','click',close_subproperties);
    addE('#select_shape','change',change_shape);
    addE('#add_shape','click',add_shape);

}

// +++++++++++++ Funciones de las sub-propiedades de un objeto ++++++++++++++
function close_subproperties() {
    _g('#sub_properties').style = "visibility: hidden;";
    _g('#select_shape').style = "visibility: hidden;";
}
// ------------- Fin de las funciones de las sub-propiedades de un objeto -------------

// Funcionalidades de figuras

// +++++++++++++ Figuras ++++++++++++++

// Actualizando el selector de figuras
async function  shapes_select() {

    var shapes = elements_array[_g('#elements').selectedIndex].shapes;
    if (
        elements_count(shapes) > 0
    ){
        var select_shape = _g('#select_shape');
        select_shape.style = "visibility: visible;";
        for (shape in shapes){
            var node = document.createElement("option");    // Create a <option> node
            var textnode = document.createTextNode(shapes[shape].name);     // Create a text node
            node.id = shape;
            node.appendChild(textnode);
            select_shape.appendChild(node);
        }
    }
}

// Mostrando figura seleccionada
async function show_shape() {
    let shapes = elements_array[_g('#elements').selectedIndex].shapes;
    if (elements_count(shapes)>0){
        let shape_table = _g('#shape_table');
        let select_shape = _g('#select_shape');
        shape_table.innerHTML = "<tr><td>" +
            "<label for='shape_name'>Nombre: </label><input type='text' id='shape_name' value = '"+shapes[select_shape.selectedIndex].name+"'/>" +
            "</td></tr>" +
            "<tr><td>" +
            "<label for='Ptos'>Ptos: </label><input type='text' id='Ptos' size='1%' value='"+JSON.stringify(shapes[select_shape.selectedIndex].shape_points)+"'/> " +
            "Marcar: <input type='checkbox' id='mark_shape'>" +
            "</td></tr>";
    }

}

function add_shape() {
    var select = _g('#elements');
    var select_shape = _g('#select_shape');
    var shape_name = prompt("Diga el nombre de la figura: ");
    if(shape_name != null){
        var shape_object = clone(shape);
        shape_object.name = shape_name;
        var table_shape = _g('#shape_table');
        table_shape.innerHTML = "<tr><td>" +
                                        "<label for='shape_name'>Nombre: </label><input type='text' id='shape_name' value = '"+shape_name+"'/>" +
                               "</td></tr>" +
                                "<tr><td>" +
                                    "<label for='Ptos'>Ptos: </label><input type='text' id='Ptos' size='1%'/> Marcar: <input type='checkbox' id='mark_shape'>" +
                                "</td></tr>";
        select_shape.style="visibility: visible;";
        var node = document.createElement("option");    // Create a <option> node
        var textnode = document.createTextNode(shape_name);     // Create a text node
        node.id = select_shape.childElementCount;
        elements_array[select.selectedIndex].shapes[node.id] = shape_object;
        node.appendChild(textnode);
        select_shape.appendChild(node);
        select_shape.selectedIndex = node.id;
    }
}

function change_shape(){
    var select = _g('#elements');
    var selected_shape = _g('#select_shape');
}

// -------------- Fin Figuras --------------

function save(){
    addE('#name','keyup',save_props,'name');
    addE('#img','change',save_props,'img');
    addE('#img_ptox','keyup',save_props,'img_ptox');
    addE('#img_ptoy','keyup',save_props,'img_ptoy');
    addE('#height','keyup',save_props,'height');
    addE('#width','keyup',save_props,'width');
    addE('#visibility','click',save_props,'visibility');
    addE('#open_shapes','click',open_subproperties,'open_shapes');
    addE('#open_events','click',open_subproperties,'open_events');
}

// -------------- Fin CRUD Figuras --------------

// +++++++++++++++ Eventos anclados al lienzo ++++++++++++++++

lienzo.addEventListener('mousemove', function (evt) {
    rect = lienzo.getBoundingClientRect();
    mousex = (evt.clientX - rect.left)*scaleX;
    mousey = (evt.clientY - rect.top)*scaleY;
}, false);

lienzo.addEventListener('click', function (evt) {
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    if(_g("#check_point").checked == true){
        _g("#img_ptox").value = mousex-object.width/2;
        _g("#img_ptoy").value = mousey-object.height/2;
        save_props("img_ptox");
        save_props("img_ptoy");
    }else if(_g("#check_shape").checked == true){

    }
}, false);

window.addEventListener("resize", function(){
    rect = lienzo.getBoundingClientRect();
    scaleX = lienzo.width / rect.width;
    scaleY = lienzo.height / rect.height;
}, false);

// ----------------- FIN Eventos anclados al lienzo -----------------

//Contar elementos de objetos

function elements_count(elements){
    var counter = 0;
    for (element in elements){
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
function addE(id, event, fun, params=null){
    _g(id).addEventListener(event,function(){
        if(params != null){
            fun(params);
        }else{
            fun();
        }
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

//Anadiendo eventos iniciales

async function add_event_handler(){
    addE('#create','click',create_element);
    addE('#remove','click',delete_element);
    addE('#elements','change',edit_element);
    addE('#generate','click',generate);
}

// Funcion inicial del sistema

(async function(){
    'use strict';
    props.innerHTML = "<div>" +
        "<select id='elements'><option id = 0>canvas</option></select>" + // Modificar para salvas en cookies
        "<input value='+' id = 'create' type='button' title=\"Crear imagen\" />" +
        "<input value='-' id = 'remove' type='button' title=\"Eliminar imagen\" />" +
        "<input value='Generar codigo' id = 'generate' type='button'/></div><br>" +
        "<div id = 'properties'></div>";

    let object = clone(elements_properties);
    object.name = 'canvas';
    object.height = 700;
    object.width = 420;
    elements_array [0] = object;
    add_event_handler();
    edit_element();

})();

// ++++++++++++++ Funcion para generar o exportar el codigo del canvas "coming sun" ++++++++++++++++++
function generate(){

}
// --------------Fin de exportacion del canvas -------------------
