// ++++++++ Variables del Sistema +++++++++

var lienzo = _g('#canvas');
var canvas = lienzo.getContext('2d');

lienzo.width = 700;
lienzo.height = 300;
lienzo.tabIndex = 0;
lienzo.style = "border: 1px solid black";
var time = null;

var mousex = 0, mousey = 0;
rect = lienzo.getBoundingClientRect();
scaleX = lienzo.width / rect.width;
scaleY = lienzo.height / rect.height;

var props = _g('#edit_canvas');

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

//Arreglo de elementos
if (window.localStorage.getItem('elements_array') != null){
    var elements_array = JSON.parse(localStorage.elements_array);
}else{
    var elements_array = {};
    let object = clone(elements_properties);
    object.name = 'canvas';
    object.height = 700;
    object.width = 300;
    elements_array [0] = object;
    localStorage.setItem('elements_array',JSON.stringify(clone(elements_array)));
}

var shape = {
    name:null,
    shape_points:null
}

//Figuras dentro del objeto
var shape_point = {
    x:null,
    y:null
}

var events_type = {
    0:'click',
    1:'dbclick',
    2:'mouseover',
    3:'mousedown',
    4:'mouseup',
    5:'keypress',
    6:'keydown',
    7:'keyup'
}

var actions = {
    0:{
        name:'scale',
        element_id:null,
        time:1,
        raize:1,
        interval:1,
        _do: function(){
            console.log(this.element_id);
        }
    },
    1:{
        name:'move_to',
        element_id:null,
        time:10,
        ptos:{},
        speed:1,
        _do: function () {
            console.log(this.element_id);
        }
    },
    2:{
        name:'toogle',
        element_id:null,
        time:null,
        efect: null,
        _do: function () {
            console.log(this.element_id);
        }
    },
    3:{
        name:'text_show',
        element_id:null,
        time:null,
        _do: function () {
            console.log(this.element_id);
        }
    },
    4:{
        name:'rotate',
        element_id:null,
        time:null,
        _do: function () {
            console.log(this.element_id);
        }
    },
    5:{
        name:'on',
        element_id:null,
        time:null,
        _do: function () {
            console.log(this.element_id);
        }
    },
    6:{
        name:'off',
        element_id:null,
        time:null,
        _do: function () {
            console.log(this.element_id);
        }
    }
}

var event = {
    type: null,
    shape: null,
    actions:{},
}

// -------- Fin Variables del Sistema ----------

// ++++Crud de objetos JSON++++

// Crear elemento imagenes
function create_element(){
    var object_name = window.prompt("Escriba un nombre para la imagen");
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
        "<td><textarea rows=\"4\" cols=\"27\" id = 'shapes' name = 'shapes' type='text' size='12%' readonly>"+JSON.stringify(object.shapes)+"</textarea></td></tr>" +
        "<tr><td colspan='2' align='right'><input type='button' id = 'open_shapes' name = 'open_shapes' value='Abrir' style='margin-right: 30%;'/></td></tr>" +
        "<tr><td><label for='event'>Eventos: </label></td>" +
        "<td><textarea rows=\"4\" cols=\"27\" id = 'events' name = 'events' type='text' size='12%' readonly>"+JSON.stringify(object.events)+"</textarea></td></tr>" +
        "<tr><td colspan='2' align='right'><input type='button' id = 'open_events' name = 'open_events' value='Abrir' style='margin-right: 30%;' /></td></tr>" +
        "</table></div>" +
        "<div style='visibility: hidden;' id='sub_properties'>" +
        "</div>";
    properties.innerHTML = html;
    save();
    show_elments();
};

// Eliminar un elemento del arreglo
function remove_element(){
    var select = _g("#elements");
    var count = 0;
    if(select.value != 'canvas') {
        delete elements_array[select.selectedIndex];
        select.remove(select.selectedIndex);
        var object_element = clone(elements_array);
        for (element in object_element){
            elements_array[count] = object_element[element];
            count++;
        }
        delete elements_array[count];
    }else alert('No es posible eliminar el canvas');
    edit_element();
};

// Mostrar todos los elementos del arreglo
function show_elments(){
    canvas.clearRect(0,0,lienzo.width, lienzo.height);
    lienzo.width = lienzo.width;
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

    window.localStorage.setItem('elements_array', JSON.stringify(clone(elements_array)));
    show_elments();
    setTimeout(show_elments,25);
};

// ++++++++++++++ Funciones de dibujo ++++++++++++++++

// Pintar lineas
function draw_line(ptox1,ptoy1,ptox2,ptoy2) {

    canvas.moveTo(ptox1, ptoy1);
    canvas.lineTo(ptox2, ptoy2);
    canvas.stroke();

}


// Pintar figuras
function draw_shapes(points){

    show_elments();
    for (point in points){
        if (point < elements_count(points)-1){
            draw_line(points[point].x, points[point].y,points[parseInt(point)+1].x,points[parseInt(point)+1].y);
        }
    }

    if(_g('#check_shape').checked == false){
        draw_line(points[elements_count(points)-1].x, points[elements_count(points)-1].y,points[0].x, points[0].y);
    }

}
// ----------------Fin de Funciones de dibujo -----------------

function open_subproperties(object){
    var sub_properties = _g('#sub_properties');
    var select = _g('#elements');

    sub_properties.innerHTML = "SubProperties: <br>" +
        "<div style='display: inline-block;'>" +
            "<input type='button' id='close_subproperties' name = 'close_subproperties' value='&times' title=\"Cerrar\"/>";
    switch (object) {
        case 'open_shapes':
            sub_properties.innerHTML = sub_properties.innerHTML.replace('SubProperties','Figuras') +
                "<input align='right' type='button' value='+' id='add_shape' name='add_shape' title=\"Adicionar Figura\" />" +
                "<input align='right' type='button' value='-' id='remove_shape' name='remove_shape' title=\"Eliminar Figura\" />" +
                "<select style='visibility: hidden' id='select_subproperties' name='select_subproperties'></select></div>" +
                "<table id='shape_table'></table>";
            shapes_select();
            show_shape();
            shape_events();
        break;
        case 'open_events':
            sub_properties.innerHTML = sub_properties.innerHTML.replace('SubProperties','Eventos') +
                "<input align='right' type='button' value='+' id='add_event' name='add_event' title=\"Adicionar Figura\" />" +
                "<input align='right' type='button' value='-' id='remove_event' name='remove_event' title=\"Eliminar Figura\" />" +
                "<select style='visibility: hidden' id='select_subproperties' name='select_subproperties'></select></div>" +
                "<table id='events_table'></table>" +
                "<table id='accion_table'></table>";
            event_select();
            show_event();
            event_events();
        break;
    }
    sub_properties.style = "visibility: visible; float: left; width: 20%;";
    addE('#close_subproperties','click',close_subproperties);
}

// +++++++++++++ Funciones de las sub-propiedades de un objeto ++++++++++++++
function close_subproperties() {
    _g('#sub_properties').style = "visibility: hidden;";
    _g('#select_subproperties').style = "visibility: hidden;";
    show_elments();
}

// ------------- Fin de las funciones de las sub-propiedades de un objeto -------------

// ++++++++++++++ Funciones de Eventos ++++++++++++++++++++++++

// ++++++++++++++++++ CRUD eventos +++++++++++++++++

// Adicionar eventos

function add_event() {
    let select = _g('#elements');
    let select_events = _g('#select_subproperties');
    if (select_events != null) {
        let index = select_events.childElementCount;
        var events_object = clone(event);
        events_object.shape = 0;
        events_object.type = 'click';
        console.log(events_object);
        let option = document.createElement("option");
        option.text = index;
        select_events.style = "visibility: visible;";
        elements_array[select.selectedIndex].events[index] = events_object;
        select_events.add(option, index);
        select_events.selectedIndex = index;
    }
    window.localStorage.setItem('elements_array', JSON.stringify(clone(elements_array)));
    show_event();
}

// Adicionar eventos

function show_event(){
    let events = elements_array[_g('#elements').selectedIndex].events;
    show_elments();
    if (elements_count(events)>0){
        let events_table = _g('#events_table');
        let select_events = _g('#select_subproperties');
        let shapes = elements_array[_g('#elements').selectedIndex].shapes;
        let option = document.createElement("option");
        let accion_table = _g('#accion_table');

        events_table.innerHTML =
            "<tr><td>" +
                "<label for='type'>Tipo: </label><select id='type'>" +
                    "<option id='"+select_events.selectedIndex+"'>"+events[select_events.selectedIndex].type+"</option>" +
            "</select></td></tr>" +
            "<tr><td>" +
                "<label for='shape'>Figura: </label><select id='shape'></select>" +
            "</td></tr><br>" +
            "<tr><td>" +
                "<label for='actions'>Acciones: </label>" +
                    "<input align='right' type='button' value='+' id='add_action' name='add_action' title=\"Adicionar Accion\" />" +
                    "<input align='right' type='button' value='-' id='remove_event' name='remove_event' title=\"Eliminar Accion\" />" +
                    "<select style='visibility: hidden' id='select_accion' name='select_accion'></select></div>" +
                    "<textarea rows=\"4\" cols=\"50\" id='actions' size='1%' readonly>"+
                        JSON.stringify(events[select_events.selectedIndex].actions)+
                "</textarea> " +
            "</td></tr>";
        _g('#events').value = JSON.stringify(elements_array[_g('#elements').selectedIndex].events);
        for (event_id in events_type){
            let option = document.createElement("option");
            if (events[select_events.selectedIndex].type != events_type[event_id]){
                option.text = events_type[event_id];
                _g('#type').add(option, events_type[event_id]);
            }
        }

        option.text = shapes[events[select_events.selectedIndex].shape].name;
        option.value = events[select_events.selectedIndex].shape;
        _g('#shape').add(option, events[select_events.selectedIndex].shape);

        for (shape_id in shapes){
            option = document.createElement("option");
            if(events[select_events.selectedIndex].shape != shape_id){
                option.text = shapes[shape_id].name;
                option.value = shape_id;
                _g('#shape').add(option, shape_id);
            }
        }
        addE('#type', 'change', save_events,'type');
        addE('#shape', 'change', save_events,'shape');
    }else{
        events_table.innerHTML ="";
    }
}

// Adicionar acciones

function show_actions(){
    console.log('1');
}

// Eliminar eventos

function remove_event(){

}

// Configurar el select de eventos

function event_select(){
    var events = elements_array[_g('#elements').selectedIndex].events;
    var select_event = _g('#select_subproperties');
    select_event.innerHTML = "";
    if (
        elements_count(events) > 0
    ){
        select_event.style = "visibility: visible;";
        for (event_id in events){
            var node = document.createElement("option");    // Create a <option> node
            var textnode = document.createTextNode(event_id);     // Create a text node
            node.id = event_id;
            node.appendChild(textnode);
            select_event.appendChild(node);
        }
        select_event.selectedIndex = 0;
    }else{
        select_event.style = "visibility: hidden;";
    }
}

// ----------------- Fin de CRUD de eventos ------------------

function save_events(id){

    let object = elements_array[_g('#elements').selectedIndex].events[_g('#select_subproperties').selectedIndex];
    let sentencia = "object."+id+" = '"+_g('#'+id).value+"'";
    eval(sentencia);
    window.localStorage.setItem('elements_array', JSON.stringify(clone(elements_array)));
}

// Eventos de eventos

function event_events() {

    addE('#add_event', 'click', add_event);
    addE('#remove_event', 'click', remove_event);
    addE('#select_subproperties', 'change', show_event);

}

// -------------- Fin de Funciones de Eventos -----------------

// Funcionalidades de figuras

// +++++++++++++ Figuras ++++++++++++++


// Actualizando el selector de figuras
function  shapes_select() {
    var shapes = elements_array[_g('#elements').selectedIndex].shapes;
    var select_shape = _g('#select_subproperties');
    select_shape.innerHTML = "";
    if (
        elements_count(shapes) > 0
    ){
        select_shape.style = "visibility: visible;";
        for (shape_id in shapes){
            var node = document.createElement("option");    // Create a <option> node
            var textnode = document.createTextNode(shapes[shape_id].name);     // Create a text node
            node.id = shape_id;
            node.appendChild(textnode);
            select_shape.appendChild(node);
        }
        select_shape.selectedIndex = 0;
    }else{
        select_shape.style = "visibility: hidden;";
    }
}

// -------------- CRUD Figuras --------------
// Mostrando figura seleccionada
function show_shape() {
    let shapes = elements_array[_g('#elements').selectedIndex].shapes;
    show_elments();
    if (elements_count(shapes)>0){
        let shape_table = _g('#shape_table');
        let select_shape = _g('#select_subproperties');
        shape_table.innerHTML = "<tr><td>" +
            "<label for='shape_name'>Nombre: </label><input type='text' id='shape_name' value = '"+shapes[select_shape.selectedIndex].name+"'/>" +
            "</td></tr>" +
            "<tr><td>" +
            "<label for='Ptos'>Ptos: </label><textarea rows=\"4\" cols=\"50\" id='Ptos' size='1%' readonly>"+JSON.stringify(shapes[select_shape.selectedIndex].shape_points)+"</textarea> " +
            "Marcar: <input type='checkbox' id='check_shape'>" +
            "</td></tr>";
        if(shapes[select_shape.selectedIndex].shape_points != null){
            draw_shapes(shapes[select_shape.selectedIndex].shape_points);
        }
        addE('#check_shape','click',shape_check);
        _g('#shapes').value = JSON.stringify(elements_array[_g('#elements').selectedIndex].shapes);
    }else{
        shape_table.innerHTML ="";
    }
}

// Adicionar figura
function add_shape() {
    var select = _g('#elements');
    var select_shape = _g('#select_subproperties');
    var shape_name = prompt("Diga el nombre de la figura: ");
    if(shape_name != null) {
        var index = select_shape.childElementCount;
        var shape_object = clone(shape);
        var option = document.createElement("option");
        shape_object.name = shape_name;
        option.text = shape_name;
        select_shape.style = "visibility: visible;";
        elements_array[select.selectedIndex].shapes[index] = shape_object;
        select_shape.add(option,index);
        select_shape.selectedIndex = index;
    }
    window.localStorage.setItem('elements_array', JSON.stringify(clone(elements_array)));
    show_shape();
}

function shape_check(){
    let shapes = elements_array[_g('#elements').selectedIndex].shapes;
    let select_shape = _g('#select_subproperties');
    draw_shapes(shapes[select_shape.selectedIndex].shape_points);
}

// Eliminar figura
function remove_shape(){

    var select = _g('#elements');
    var selected_shape = _g('#select_subproperties');
    delete elements_array[select.selectedIndex].shapes[selected_shape.selectedIndex];
    var object_shapes = clone(elements_array[select.selectedIndex].shapes);
    var count = 0;
    for (shape_id in object_shapes){
        elements_array[select.selectedIndex].shapes[count] = object_shapes[shape_id];
        count++;
    }
    delete elements_array[select.selectedIndex].shapes[count];
    shapes_select();
    show_elments();
    show_shape();

}
// -------------- Fin CRUD Figuras --------------

// Eventos de figuras

function shape_events(){
    addE('#remove_shape','click',remove_shape);
    addE('#select_subproperties','change',show_shape);
    addE('#add_shape','click',add_shape);
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

// ++++++++++++++++++++++ Eventos anclados al lienzo ++++++++++++++++++++

// ++++++++++++++++++++++++++ TU CODIGO VA AQUI +++++++++++++++++++++++++

lienzo.addEventListener('mousemove', function (evt) {
    rect = lienzo.getBoundingClientRect();
    mousex = (evt.clientX - rect.left)*scaleX;
    mousey = (evt.clientY - rect.top)*scaleY;
}, false);

lienzo.addEventListener('mousedown', function (evt) {
    var select = _g("#elements");
    var object = elements_array[select.selectedIndex];
    if(_g("#check_point").checked == true && evt.which == 1){
        _g("#img_ptox").value = mousex-object.width/2;
        _g("#img_ptoy").value = mousey-object.height/2;
        save_props("img_ptox");
        save_props("img_ptoy");
    }else if(_g("#check_shape").checked == true && evt.which == 1){
        var select_shape = _g('#select_subproperties');
        var ptos = elements_array[select.selectedIndex].shapes[select_shape.selectedIndex].shape_points;
        if(ptos == null){
            let shape_points = clone(shape_point);
            shape_points.x = Math.round(mousex,2);
            shape_points.y = Math.round(mousey,2);
            elements_array[select.selectedIndex].shapes[select_shape.selectedIndex].shape_points={0:shape_points};
            draw_line(mousex-1,mousey,mousex+1,mousey);
            draw_line(mousex,mousey-1,mousex,mousey+1);
        }else{
            elements_array[select.selectedIndex].shapes[select_shape.selectedIndex].shape_points[elements_count(ptos)]={
                'x':Math.round(mousex,2),
                'y':Math.round(mousey,2)
            };
            _g('#Ptos').value = JSON.stringify(ptos);
            draw_shapes(ptos);
        }
    }else if(_g("#check_shape").checked == true && evt.which == 2){
        var shapes = elements_array[_g('#elements').selectedIndex].shapes[_g('#select_subproperties').selectedIndex];
        delete shapes.shape_points[elements_count(shapes.shape_points)-1];
        _g('#Ptos').value = JSON.stringify(shapes.shape_points);
        draw_shapes(shapes.shape_points);
    }
}, false);

window.addEventListener("resize", function(){
    rect = lienzo.getBoundingClientRect();
    scaleX = lienzo.width / rect.width;
    scaleY = lienzo.height / rect.height;
}, false);

// ------------------------ FIN DE TU CODIGO -----------------------

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

// ++++++++++++++++++ Salvas +++++++++++++++++++

function delete_save(){
    localStorage.removeItem('elements_array');
}

// -----------------Fin de Salvas --------------

//Anadiendo eventos iniciales

function add_event_handler(){
    addE('#create','click',create_element);
    addE('#remove','click',remove_element);
    addE('#elements','change',edit_element);
    addE('#generate','click',generate);
    addE('#delete_save','click',delete_save);

}

// Funcion inicial del sistema

(function(){
    'use strict';
    props.innerHTML = "<div>" +
        "<select id='elements'><option id = 0>canvas</option></select>" + // Modificar para salvas en cookies
        "<input value='+' id = 'create' type='button' title=\"Crear imagen\" />" +
        "<input value='-' id = 'remove' type='button' title=\"Eliminar imagen\" />" +
        "<input value='Generar codigo' id = 'generate' type='button'/>" +
        "<input value='Eliminar salva' id = 'delete_save' type='button'/></div><br>" +
        "<div id = 'properties'></div>";
    add_event_handler();
    edit_element();
})();

// ++++++++++++++ Funcion para generar o exportar el codigo del canvas "coming sun" ++++++++++++++++++
function generate(){
    alert('Comming sun boby');
}
// --------------Fin de exportacion del canvas -------------------
