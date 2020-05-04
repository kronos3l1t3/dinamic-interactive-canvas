// ++++++++ Variables del Sistema +++++++++

var lienzo = _g('#canvas');
var canvas = lienzo.getContext('2d');

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

lienzo.width = elements_array[0].height;
lienzo.height = elements_array[0].width;

lienzo.style = "border: 1px solid black";
var time = null;

var mousex = 0, mousey = 0;
rect = lienzo.getBoundingClientRect();
scaleX = lienzo.width / rect.width;
scaleY = lienzo.height / rect.height;

var shape = {
    name:null,
    shape_points:null
}

//Figuras dentro del objeto
var shape_point = {
    ptox:null,
    ptoy:null
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
        name:'move_to',
        element_id:0,
        time:1,
        ptos:{},
        speed:1,
        inc: null,
        do_now: function () {
            move_to(
                this.element_id,
                this.time,
                clone(this.ptos),
                this.speed,
                this.inc
            );

        }
    },
    1:{
        name:'scale',
        element_id:null,
        time:1,
        speed:1,
        raize:1,
        do_now: function(){
            scale(
                this.element_id,
                this.time,
                this.speed,
                this.inc
            );
        }
    },
    2:{
        name:'toggle',
        element_id:null,
        time:null,
        do_now: function () {
            toggle(this.element_id,this.time);
        }
    },
    3:{
        name:'text_show',
        element_id:null,
        time:null,
        do_now: function () {
            console.log(this.element_id);
        }
    },
    4:{
        name:'rotate',
        element_id:null,
        time:null,
        do_now: function () {
            console.log(this.element_id);
        }
    },
    5:{
        name:'on',
        element_id:null,
        time:null,
        do_now: function () {
            element_on(
                this.element_id,
                this.time
            );
        }
    },
    6:{
        name:'off',
        element_id:null,
        time:null,
        do_now: function () {
            element_off(
                this.element_id,
                this.time
            );
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
    let object_name = window.prompt("Escriba un nombre para la imagen");
    if (object_name != null){
        let elements_variable = _g("#elements");
        let node = document.createElement("option");    // Create a <option> node
        let textnode = document.createTextNode(object_name);     // Create a text node
        let object = clone(elements_properties);
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
    let select = _g("#elements");
    let object = elements_array[select.selectedIndex];
    let properties = _g("#properties");
    let html = "<div style='visibility: visible; width: 30%; float: left;'><table>" +
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
    let select = _g("#elements");
    let count = 0;
    if(select.value != 'canvas') {
        delete elements_array[select.selectedIndex];
        select.remove(select.selectedIndex);
        let object_element = clone(elements_array);
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
            let img = new Image();
            img.src = elements_array[element].img;
            draw_image(
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
    let select = _g("#elements");
    let object = elements_array[select.selectedIndex];
    let sentence = null;
    switch (id_name) {
        case 'img':
            sentence = "object."+id_name+" = "+"'img/object/"+_g("#"+id_name).value.replace("C:\\fakepath\\","")+"'";
            break;
        case 'visibility':
            sentence = "object."+id_name+" = "+_g("#"+id_name).checked;
            break;
        default:
            sentence = "object."+id_name+" = "+_g("#"+id_name).value;
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

// ++++++++++++++ Funciones de dibujo ++++++++++++++++

// Pintar Imagenes Exportar
function draw_image(img, ptox,ptoy,heiht,width){
    canvas.drawImage(
        img,
        ptox,
        ptoy,
        heiht,
        width
    );
}

// Pintar lineas
function draw_line(ptox1,ptoy1,ptox2,ptoy2) {
    canvas.moveTo(ptox1, ptoy1);
    canvas.lineTo(ptox2, ptoy2);
    canvas.stroke();
}

// Pintar figuras
function draw_shapes(points, diff_x = 0, diff_y = 0){
    show_elments();
    for (point in points){
        if (point < elements_count(points)-1){
            draw_line(
                points[point].ptox + diff_x,
                points[point].ptoy + diff_y,
                points[parseInt(point)+1].ptox + diff_x,
                points[parseInt(point)+1].ptoy + diff_y
            );
        }
    }
    if(_g('#check_shape') != null && _g('#check_shape').checked == false){
        draw_line(points[elements_count(points)-1].ptox, points[elements_count(points)-1].ptoy,points[0].ptox, points[0].ptoy);
    }
}
// ----------------Fin de Funciones de dibujo -----------------

function open_subproperties(object){
    let sub_properties = _g('#sub_properties');
    let select = _g('#elements');
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
                "<input align='right' type='button' value='+' id='add_event' name='add_event' title=\"Adicionar Evento\" />" +
                "<input align='right' type='button' value='-' id='remove_event' name='remove_event' title=\"Eliminar Evento\" />" +
                "<select style='visibility: hidden' id='select_subproperties' name='select_subproperties'></select></div>" +
                "<table id='events_table'></table>" +
                "<table id='actions_table'></table>";
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
        let events_object = clone(event);
        events_object.shape = 0;
        events_object.type = 'click';
        let option = document.createElement("option");
        option.text = index;
        select_events.style = "visibility: visible;";
        elements_array[select.selectedIndex].events[index] = events_object;
        select_events.add(option, index);
        select_events.selectedIndex = index;
    }
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
                "<label for='actions'>Animaciones: </label>" +
                    "<input align='right' type='button' value='+' id='add_action' name='add_action' title=\"Adicionar Accion\" />" +
                    "<input style='visibility: hidden' align='right' type='button' value='-' id='remove_action' name='remove_action' title=\"Eliminar Accion\" />" +
                    "<select style='visibility: hidden' id='select_action' name='select_action'></select></td></tr>" +
            "<tr><td><textarea rows=\"4\" cols=\"50\" id='actions' size='1%' readonly>"+
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
        addE('#add_action', 'click',add_action);

    }else{
        events_table.innerHTML ="";
    }
}

// Eliminar eventos

function remove_event(){ // Falta

}

// Configurar el select de eventos

function event_select(){
    let events = elements_array[_g('#elements').selectedIndex].events;
    let select_event = _g('#select_subproperties');
    select_event.innerHTML = "";
    if (
        elements_count(events) > 0
    ){
        select_event.style = "visibility: visible;";
        for (event_id in events){
            let node = document.createElement("option");    // Create a <option> node
            let textnode = document.createTextNode(event_id);     // Create a text node
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
    let sentence = "object."+id+" = '"+_g('#'+id).value+"'";
    eval(sentence);
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
    let shapes = elements_array[_g('#elements').selectedIndex].shapes;
    let select_shape = _g('#select_subproperties');
    select_shape.innerHTML = "";
    if (
        elements_count(shapes) > 0
    ){
        select_shape.style = "visibility: visible;";
        for (shape_id in shapes){
            let node = document.createElement("option");    // Create a <option> node
            let textnode = document.createTextNode(shapes[shape_id].name);     // Create a text node
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
            "<label for='Ptos'>Puntos: </label><textarea rows=\"4\" cols=\"50\" id='Ptos' size='1%' readonly>"+JSON.stringify(shapes[select_shape.selectedIndex].shape_points)+"</textarea> " +
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
    let select = _g('#elements');
    let select_shape = _g('#select_subproperties');
    let shape_name = prompt("Diga el nombre de la figura: ");
    if(shape_name != null) {
        let index = select_shape.childElementCount;
        let shape_object = clone(shape);
        let option = document.createElement("option");
        shape_object.name = shape_name;
        option.text = shape_name;
        select_shape.style = "visibility: visible;";
        elements_array[select.selectedIndex].shapes[index] = shape_object;
        select_shape.add(option,index);
        select_shape.selectedIndex = index;
    }
    show_shape();
}

function shape_check(){
    let shapes = elements_array[_g('#elements').selectedIndex].shapes;
    let select_shape = _g('#select_subproperties');
    draw_shapes(shapes[select_shape.selectedIndex].shape_points);
}

// Eliminar figura
function remove_shape(){
    let select = _g('#elements');
    let selected_shape = _g('#select_subproperties');
    delete elements_array[select.selectedIndex].shapes[selected_shape.selectedIndex];
    let object_shapes = clone(elements_array[select.selectedIndex].shapes);
    let count = 0;
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

// Eventos para crear animaciones

lienzo.addEventListener('mousedown', function (evt) {
    let select = _g("#elements");
    let object = elements_array[select.selectedIndex];
    if(_g("#check_point").checked == true && evt.which == 1){
        _g("#img_ptox").value = parseFloat(mousex-object.width/2,2);
        _g("#img_ptoy").value = parseFloat(mousey-object.height/2,2);
        save_props("img_ptox");
        save_props("img_ptoy");
    }else if(_g("#check_shape")!=null && _g("#check_shape").checked == true && evt.which == 1){
        let select_shape = _g('#select_subproperties');
        let ptos = elements_array[select.selectedIndex].shapes[select_shape.selectedIndex].shape_points;
        if(ptos == null){
            let shape_points = clone(shape_point);
            shape_points.ptox = Math.round(mousex,2);
            shape_points.ptoy = Math.round(mousey,2);
            elements_array[select.selectedIndex].shapes[select_shape.selectedIndex].shape_points={0:shape_points};
            draw_line(mousex-1,mousey,mousex+1,mousey);
            draw_line(mousex,mousey-1,mousex,mousey+1);
        }else{
            elements_array[select.selectedIndex].shapes[select_shape.selectedIndex].shape_points[elements_count(ptos)]={
                'ptox':Math.round(mousex,2),
                'ptoy':Math.round(mousey,2)
            };
            _g('#Ptos').value = JSON.stringify(ptos);
            draw_shapes(ptos);
        }
    }else if(_g("#check_shape")!=null && _g("#check_shape").checked == true && evt.which == 2){
        let shapes = elements_array[_g('#elements').selectedIndex].shapes[_g('#select_subproperties').selectedIndex];
        delete shapes.shape_points[elements_count(shapes.shape_points)-1];
        _g('#Ptos').value = JSON.stringify(shapes.shape_points);
        draw_shapes(shapes.shape_points);
    }else if(_g("#action_check")!=null && _g("#action_check").checked == true && evt.which == 1){
        let select_event = _g('#select_subproperties');
        let actions = _g('#select_action');
        let action = elements_array[select.selectedIndex].events[select_event.selectedIndex].actions[actions.selectedIndex];
        let ptos = action.ptos;
        let img = new Image();
        img.src = elements_array[action.element_id].img;
        if(JSON.stringify(ptos).toString().length == 2){
            let shape_points = clone(shape_point);
            shape_points.ptox = Math.round(mousex,2)-(elements_array[action.element_id].width/2);
            shape_points.ptoy = Math.round(mousey,2)-(elements_array[action.element_id].height/2);
            action.ptos={0:shape_points};

            let img = new Image();
            img.src = elements_array[action.element_id].img;
            show_elments();
            draw_image(
                img,
                shape_points.ptox,
                shape_points.ptoy,
                elements_array[action.element_id].height,
                elements_array[action.element_id].width
            );
        }else{
            let ptox = (Math.round(mousex,2)-(elements_array[action.element_id].width/2));
            let ptoy = (Math.round(mousey,2)-(elements_array[action.element_id].height/2));
            elements_array[select.selectedIndex].events[select_event.selectedIndex].actions[actions.selectedIndex].ptos[elements_count(ptos)]={
                'ptox':ptox,
                'ptoy':ptoy
            };
            _g('#ptos').value = JSON.stringify(ptos);
            show_elments();
            draw_shapes(ptos, (elements_array[action.element_id].width/2), (elements_array[action.element_id].height/2));
            draw_image(
                img,
                ptox,
                ptoy,
                elements_array[action.element_id].height,
                elements_array[action.element_id].width
            );
        }
    }
}, false);

// Eventos reales del sistema Exportar

lienzo.addEventListener('mousedown', function (evt) {
    if(evt.which == 1){
        let elements = clone(elements_array);
        for (element in elements){
            let events = clone(elements_array[element].events);
            let cont = element;
            for(event in events){
                if(elements_array[cont].events[event].type == "click"){
                    if(belongs_to_shape(elements_array[cont].shapes[elements_array[cont].events[event].shape], {ptox:Math.round(mousex,2),ptoy:Math.round(mousey,2)})){
                        let actions = elements_array[cont].events[event].actions;
                        for (action in actions){
                            if(elements_array[cont].events[event].actions[action].do_now != null){
                                elements_array[cont].events[event].actions[action].do_now();
                            }
                        }
                    }
                }
            }
        }
    }
},false);

// Recalcular tamano del lienzo Exportar

window.addEventListener("resize", function(){
    rect = lienzo.getBoundingClientRect();
    scaleX = lienzo.width / rect.width;
    scaleY = lienzo.height / rect.height;
}, false);

// ------------------------ FIN DE TU CODIGO -----------------------

// ----------------- FIN Eventos anclados al lienzo -----------------

//Contar elementos de objetos

function elements_count(elements){
    let counter = 0;
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
    let copy = obj.constructor();
    for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
};

// ++++++++++++++++++ Salvas +++++++++++++++++++

// Guardar proyecto
function salva_save(){
    localStorage.setItem('elements_array', JSON.stringify(elements_array));
}

// Borrar salvas

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
    addE('#salva_save','click',salva_save);
    addE('#delete_save','click',delete_save);
}

// Funcion inicial del sistema

(function(){
    'use strict';
    props.innerHTML = "<div>" +
        "<select id='elements'></select>" + // Modificar para salvas en cookies
        "<input value='+' id = 'create' type='button' title=\"Crear imagen\" />" +
        "<input value='-' id = 'remove' type='button' title=\"Eliminar imagen\" />" +
        "<input value='Generar codigo' id = 'generate' type='button'/>" +
        "<input value='Salva' id = 'salva_save' type='button'/>" +
        "<input value='Eliminar' id = 'delete_save' type='button'/></div><br>" +
        "<div id = 'properties'></div>";

    let var_elements = _g('#elements');

    for (let arr_element in elements_array){
        let option = document.createElement("option");
        option.id = arr_element;
        option.text = elements_array[arr_element].name;
        var_elements.add(option);
    }

    add_event_handler();
    edit_element();

})();

// ++++++++++++++ Funcion para generar o exportar el codigo del canvas "coming sun" ++++++++++++++++++
function generate(){
    var my_code = window.open();
    my_code.document.write("// Elementos del proyecto");
    my_code.document.write("<br>");
    my_code.document.write("<br>");
    my_code.document.write("elements_array="+JSON.stringify(elements_array));
    my_code.document.write("<br>");
}
// --------------Fin de exportacion del canvas -------------------


// +++++++++++++++++++++++ FUNCIONES DE ACCIONES +++++++++++++++++++++++++

// ++++++++++++++++++++++++++ CRUD de Acciones +++++++++++++++++++++++++++

// Adicionar acciones

function add_action(){
    let action = clone(actions[0]);
    let var_actions = elements_array[_g('#elements').selectedIndex].events[_g('#select_subproperties').selectedIndex].actions;
    let count = _g('#select_action').childElementCount;
    var_actions[count]=action;
    let option = document.createElement('option');
    option.text = count;
    option.value = count;
    option.id = count;
    _g('#select_action').add(option);
    _g('#remove_action').style="visibility: visible;";
    let actions_table = _g('#actions_table');
    actions_table.innerHTML = select_action_type();
    show_action();
}

// Generar el select de tipos de acciones

function chage_action_type(){
    let actions_table = _g('#actions_table');
    let action_type = _g('#action_type');
    let action = clone(actions[_g('#action_type').selectedIndex]);
    let var_actions = elements_array[_g('#elements').selectedIndex].events[_g('#select_subproperties').selectedIndex].actions;
    let count = _g('#select_action').value;
    var_actions[count]=action;
    show_action();
}

function select_action_type(option = null){
    _g('#select_action').style="visibility: visible;";
    let select = "<tr><td><select id='action_type' name='action_type'>";
    if(option != null){
        select+="<option id="+actions[option].id+">"+actions[option].name+"</option>";
    }
    for (action in actions){
        if(action != option){
            select += "<option id="+actions[action].id+">"+actions[action].name+"</option>";
        }
    }
    select += "</select></td></tr>";
    return select;
}

function select_element(){
    let select = "<tr><td><select id='select_shape_action'>";
    for (let element in elements_array){
        select+="<option id="+element+" value="+element+">"+elements_array[element].name+"</option>";
    }
    select += "</select></td></tr>";
    return select;
}
// Mostrar acciones

// Funcion de salva de propiedades
function event_action_save(params) {
    let parameters = params.split(",");
    for (params in parameters){
        addE('#'+parameters[params], 'keyup', save_action_props,parameters[params]);
    }
}

function save_action_props(param) {
    let sentence = "elements_array[_g('#elements').selectedIndex].events[_g('#select_subproperties').selectedIndex].actions[_g('#select_action').selectedIndex]."+
                    param+"="+"'"+_g('#'+param).value+"'";
    eval(sentence);
}

function save_select_action() {
    elements_array[_g('#elements').selectedIndex].
        events[_g('#select_subproperties').selectedIndex].
        actions[_g('#select_action').selectedIndex].
        element_id = _g('#select_shape_action').value;
}

function test() {
    elements_array[_g('#elements').selectedIndex].events[_g('#select_subproperties').selectedIndex].actions[_g('#select_action').selectedIndex].do_now();
}

function show_action(){

    let actions_table = _g('#actions_table');
    switch (_g('#action_type').value) {

        case 'move_to':

            actions_table.innerHTML += select_element();
            actions_table.innerHTML += "<tr><td><label for='time'>Tiempo:</label><input id ='time' type='text' size='1%' value=1000 /></td></tr>";
            actions_table.innerHTML += "<tr><td><label for='speed'>Velocidad (px/s):</label><input id ='speed' type='text' size='1%' value=20 /></td></tr>";
            actions_table.innerHTML += "<tr><td><label for='inc'>Incremento:</label><input id ='inc' type='text' size='1%' /></td></tr>";
            actions_table.innerHTML += "<tr><td><label for='ptos'>Puntos:</label><br><textarea id ='ptos' readonly='true'></textarea></td></tr>";
            actions_table.innerHTML += "<tr><td><label for='action_check'>Marcar:</label><input id ='action_check' readonly='true' type='checkbox' size='1%' ></input></td></tr>";
            actions_table.innerHTML += "<tr><td><input id ='test' readonly='true' type='button' value='Probar' ></input></td></tr>";
            addE('#select_shape_action','change',save_select_action);
            addE('#test','click',test);
            addE('#action_type','change',chage_action_type);
            event_action_save("time,speed,inc");

            break;
        case 'scale':
            break;
        case 'toggle':

            actions_table.innerHTML = select_action_type(2);
            actions_table.innerHTML += select_element();
            actions_table.innerHTML += "<tr><td><label for='time'>Tiempo:</label><input id ='time' type='text' size='1%' value=1000 /></td></tr>";
            addE('#select_shape_action','change',save_select_action);
            event_action_save("time");

            break;
        case 'text_show':
            break;
        case 'rotate':
            break;
        case 'on':

            actions_table.innerHTML = select_action_type(5);
            actions_table.innerHTML += select_element();
            actions_table.innerHTML += "<tr><td><label for='time'>Tiempo:</label><input id ='time' type='text' size='1%' value=1000 /></td></tr>";

            addE('#select_shape_action','change',save_select_action);
            event_action_save("time");

            break;
        case 'off':

            actions_table.innerHTML = select_action_type(6);
            actions_table.innerHTML += select_element();
            actions_table.innerHTML += "<tr><td><label for='time'>Tiempo:</label><input id ='time' type='text' size='1%' value=1000 /></td></tr>";

            addE('#select_shape_action','change',save_select_action);
            event_action_save("time");

            break;
    }

}

// Editar acciones

function edit_action(){

}

// Eliminar acciones

function remove_action(){

}


// ---------------Fin de CRUD de acciones ------------------


// ++++++++++++++++++++++++++++++++++++++ FUNCIONES DE ANIMACIONES +++++++++++++++++++++++++++++++++++++++

// Movimiento de una imagen hacia un punto o varios puntos "Trayectoria";
async function move_to(element_id,time,ptos,speed, line = null, ptos_init = null ,factor = null){

    if(ptos_init == null){
        ptos_init = {ptox:elements_array[element_id].img_ptox, ptoy:elements_array[element_id].img_ptoy};
    };
    let len = JSON.stringify(ptos).length;
    let x = parseInt(ptos[0].ptox) - parseInt(elements_array[element_id].img_ptox);
    let y = parseInt(ptos[0].ptoy) - parseInt(elements_array[element_id].img_ptoy);
    if(line == null || ((x<=factor+1 && x >=-factor-1) && (y>=-1 && y <= 1))){
        if((x<=1 && x >=-1) && (y>=-1 && y <= 1)){
            elements_array[element_id].img_ptox = ptos[0].ptox;
            elements_array[element_id].img_ptoy = ptos[0].ptoy;
            delete ptos[0];
            let count = 0;
            for (element in ptos){
                ptos[count] = ptos[element];
                count++;
            }
            delete ptos[count];
            len = JSON.stringify(ptos).length;
        }
        if(len > 2) {
            line = get_line({ptox:elements_array[element_id].img_ptox, ptoy:elements_array[element_id].img_ptoy}, ptos[0]);
            factor = get_factor(
                elements_array[element_id].img_ptox,
                elements_array[element_id].img_ptoy,
                ptos[0].ptox,
                ptos[0].ptoy,
                speed,
                line
            );
        }
    }

    if(len > 2) {
        if(elements_array[element_id].img_ptox<ptos[0].ptox){
            elements_array[element_id].img_ptox += factor;
        }else{
            elements_array[element_id].img_ptox -= factor;
        }
        elements_array[element_id].img_ptoy = (line.pendiente*elements_array[element_id].img_ptox)+line.n;
        show_elments();
        setTimeout(move_to, time, element_id, 25, ptos, speed, line, ptos_init, factor);
    }else{
        correction_shapes(ptos_init, element_id);
    }
}

// Toggle

async function toggle(element_id, time = null){
    (elements_array[element_id].visibility)?(element_off(element_id,time)):(element_on(element_id,time));
};

// Scala de imagen

// Rotacion de imagen

// Insercion de nueva imagen

// Ciclo de trayectoria

// Mensaje

// Seguimiento

// Activar imagen

async function element_on(element_id, time = null) {
    elements_array[element_id].visibility = true;
    setTimeout(show_elments,25);
    setTimeout(show_elments,100);
}

// Desactivar imagen

async function element_off(element_id, time = null) {
    elements_array[element_id].visibility = false;
    setTimeout(show_elments,25);
    setTimeout(show_elments,100);
}

// ------------------------------------- FIN  FUNCIONES DE ANIMACIONES ---------------------------------------

// Correccion de figuras despues del movimiento del elemento

function correction_shapes(ptos_init, element_id) {
    let inc_x = elements_array[element_id].img_ptox - ptos_init.ptox;
    let inc_y = elements_array[element_id].img_ptoy - ptos_init.ptoy;
    var instance_shapes = elements_array[element_id].shapes;

    for (shape in instance_shapes){
        var intance_ptos = instance_shapes[shape].shape_points;
        for (pto in intance_ptos){
            intance_ptos[pto].ptox += inc_x;
            intance_ptos[pto].ptoy += inc_y;
        }
    }
}

// Obteniendo factor de incremento

function get_factor(x1,y1,x2,y2,speed,line){

    let distance = distance_beteewn_2points(x1,y1,x2,y2);
    let steps = speed*(0.05);
    let x = 0;
    if(x1<x2){
        x = x1 + 1;
    }else{
        x = x1 - 1;
    }
    let y = (line.pendiente*x)+line.n;
    return steps/distance_beteewn_2points(x1, y1, x,y);

}

// Distancia entre puntos

function distance_beteewn_2points(ptox1, ptoy1, ptox2, ptoy2){
    let cateto_a = ptox1-ptox2;
    let cateto_b = ptoy1-ptoy2;
    return Math.sqrt(Math.pow(cateto_a, 2)+Math.pow(cateto_b, 2));
}

// Obtener recta

function get_line(ptoA,ptoB){

    //variables de la primera recta
    let x11 = parseFloat(ptoA.ptox, 2);
    let x12 = parseFloat(ptoB.ptox, 2);
    let y11 = parseFloat(ptoA.ptoy, 2);
    let y12 = parseFloat(ptoB.ptoy, 2);
    //pendiente de la primera recta
    let pendiente1 = (y12 - y11)/(x12 - x11);
    //n de la primera recta
    let n1 = ptoB.ptoy - (pendiente1*ptoB.ptox);
    let recta = {
        "pendiente":pendiente1,
        "n":n1,
    }
    return recta;
}

// Funcionlidad comprobacion de click perteneciente a una figura

function belongs_to_shape(shape, mouse_point) {
    let count = 1;
    let count2 = 0;
    let counter = elements_count(shape.shape_points)-1;
    for (;count<counter;){
        let pto_interception = pto_cross_lines(
            {
                ptox: mousex,
                ptoy: mousey
            },
            shape.shape_points[count2],
            shape.shape_points[count],
            shape.shape_points[count + 1]
        );
        if (
            beteew_ptos(pto_interception, shape.shape_points[count], shape.shape_points[count+1]) &&
            (
                distance_beteewn_2points(mousex, mousey, shape.shape_points[count2].ptox, shape.shape_points[count2].ptoy) <=
                distance_beteewn_2points(pto_interception.ptox, pto_interception.ptoy, shape.shape_points[count2].ptox, shape.shape_points[count2].ptoy)
            ) && (
                distance_beteewn_2points(mousex, mousey, shape.shape_points[count].ptox, shape.shape_points[count].ptoy) <=
                distance_beteewn_2points(shape.shape_points[count].ptox, shape.shape_points[count].ptoy, shape.shape_points[count2].ptox, shape.shape_points[count2].ptoy)
            )) {
            return true;
        }
        count+=1;
    };
    return false;
}

// Punto de intercepcion entre rectas

function pto_cross_lines(ptoP, pto1, pto2, pto3){

    //obteniendo primera recta
    let line1 = get_line(pto1, ptoP);

    //obteniendo segunda recta
    let line2 = get_line(pto2, pto3);
    //obteniendo punto de interseccion

    let pto_intercepcion = {
        "ptox": (line2.n-line1.n)/(line2.pendiente-line1.pendiente)
    };
    if (Math.sign(pto_intercepcion.ptox) == -1){
        pto_intercepcion.ptox = -pto_intercepcion.ptox;
    };
    pto_intercepcion.ptoy = (line2.pendiente*pto_intercepcion.ptox)+line2.n;

    return pto_intercepcion;
}

// El punto p se encuentra entre 2 puntos

function beteew_ptos(ptoP, pto2, pto3){
    let x = (Math.sign(ptoP.ptox-pto2.ptox) == -1)?(Math.sign(ptoP.ptox-pto3.ptox) != -1):(Math.sign(ptoP.ptox-pto3.ptox) == -1);
    return (x)?(Math.sign(ptoP.ptoy-pto2.ptoy) == -1)?(Math.sign(ptoP.ptoy-pto3.ptoy) != -1):(Math.sign(ptoP.ptoy-pto3.ptoy) == -1):(x);
}

// ------------------------- Funciones de acciones -----------------------------
