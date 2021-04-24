//Variables 
const form = document.querySelector('#agregar-gasto');
const gastoList = document.querySelector('#gastos ul');
let presupuesto;

//Eventos
iniciarEventos();

function iniciarEventos(){
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  form.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto{
  constructor(presupuesto, restante){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto){
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI{
  insertPresu(cant){
    const {presupuesto, restante} = cant;
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(msj, tipo){
    const div = document.createElement('DIV');
    div.classList.add('text-center', 'alert');
    if(tipo === 'error'){
      div.classList.add('alert-danger');
    }
    else{
      div.classList.add('alert-success');
    }
    div.textContent = msj;
    document.querySelector('.primario').insertBefore(div, form);

    setTimeout(() => div.remove(), 3000);
  }

  imprimirGastos(g){

    //Eliminar el html previo
    this.limpiarHTML();

    g.forEach(gasto => {
      const {nombre, cantidad, id} = gasto;
      //Crear li
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.dataset.id = id;
      //Agregar el HTML del nuevo gasto
      li.innerHTML = `
        ${nombre}<span class="badge badge-primary badfe-pill">$${cantidad}</span>
      `;
      //Boton para borrar el gasto
      const btnBorr = document.createElement('button');
      btnBorr.className = 'btn btn-danger borrar-gasto';
      btnBorr.onclick = () => {
        eliminarGasto(id);
      }
      btnBorr.innerHTML = 'Borrar &times';
      li.appendChild(btnBorr);
      //Agregar al HTML
      gastoList.appendChild(li);
    });
  }

  actualizarRestante(r){
    document.querySelector('#restante').textContent = r;
  }

  comprobarPresu(p){
    const {presupuesto, restante} = p;
    const res = document.querySelector('.restante');
    //Comprobar 25%
    if((presupuesto / 4) > restante){
      res.classList.remove('alert-success', 'alert-warning');
      res.classList.add('alert-danger');
    }
    else if((presupuesto / 2) > restante){
      res.classList.remove('alert-success', 'alert-danger');
      res.classList.add('alert-warning');
    }
    else{
      res.classList.remove('alert-warning', 'alert-danger');
      res.classList.add('alert-success');
    }

    //Si el restante es menor a 0
    if(restante <= 0){
      ui.imprimirAlerta('Su presupuesto se ha terminado', 'error');
      form.querySelector("button[type='submit']").disabled = true;
    }
  }

  limpiarHTML(){
    while(gastoList.firstChild){
      gastoList.removeChild(gastoList.firstChild);
    }
  }
}

const ui = new UI();
//Funciones
function preguntarPresupuesto(){
  const presu = prompt('¿Cual es tu presupuesto?');

  if(presu === '' || presu === null || isNaN(presu) || presu <= 0){
    window.location.reload();
  }

  //El valor del rpesupuesto es valido
  presupuesto = new Presupuesto(presu);
  
  ui.insertPresu(presupuesto);
}

function agregarGasto(e){
  e.preventDefault();
  //Leer los datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  //Validar 
  if(nombre === '' || cantidad === ''){
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
    return;    
  }
  else if(cantidad <= 0 || isNaN(cantidad)){
    ui.imprimirAlerta('La cantidadad no es valida', 'error');
    return;
  }
  
  //Generar objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now()}
  //Llamanos al metodo para asignar el gasto
  presupuesto.nuevoGasto(gasto);
  //imprimimos el mensaje
  ui.imprimirAlerta('Gasto agregado correctamente');
  //Imprimir los gastos
  const {gastos, restante} = presupuesto;
  ui.imprimirGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresu(presupuesto);
  //Reseteamos el formulario
  form.reset();
}

function eliminarGasto(id){
  presupuesto.eliminarGasto(id);
  const {gastos, restante} = presupuesto
  //Eliminar los gastos del HTML
  ui.imprimirGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresu(presupuesto);
}