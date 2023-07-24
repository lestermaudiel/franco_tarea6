
const formularioClientes = document.querySelector('form');
const btnBuscarCliente = document.getElementById('btnBuscarCliente');
const btnModificarCliente = document.getElementById('btnModificarCliente');
const btnGuardarCliente = document.getElementById('btnGuardarCliente');
const btnCancelarAccion = document.getElementById('btnCancelarAccion');
const divTablaClientes = document.getElementById('divTablaClientes');
const tablaClientes = document.getElementById('tablaClientes');

btnModificarCliente.disabled = true;
btnModificarCliente.parentElement.style.display = 'none';
btnCancelarAccion.disabled = true;
btnCancelarAccion.parentElement.style.display = 'none';

const guardarCliente = async (evento) => {
  evento.preventDefault();
  if (!validarFormulario(formularioClientes, ['cliente_id'])) {
    Swal.fire('Error', 'Debe llenar todos los campos', 'error');
    return;
  }

  const body = new FormData(formularioClientes);
  body.append('tipo', 1);
  body.delete('cliente_id');
  const url = '/franco_tarea6/controladores/clientes/index.php';
  const config = {
    method: 'POST',
    body,
  };

  try {
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    console.log(data);

    const { codigo, mensaje, detalle } = data;

    switch (codigo) {
      case 1:
        formularioClientes.reset();
        buscarClientes();

        Swal.fire('Guardado', mensaje, 'success');
        break;

      case 0:
        console.log(detalle);

        Swal.fire('Error, verifique sus datos', mensaje, 'error');
        break;

      default:
        break;
    }

  } catch (error) {
    console.log(error);
  }
};

const buscarClientes = async () => {
  let cliente_nombre = formularioClientes.cliente_nombre.value;
  let cliente_nit = formularioClientes.cliente_nit.value;
  const url = `/franco_tarea6/controladores/clientes/index.php?cliente_nombre=${cliente_nombre}&cliente_nit=${cliente_nit}`;
  const config = {
    method: 'GET'
  };

  try {
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();

    tablaClientes.tBodies[0].innerHTML = '';
    const fragment = document.createDocumentFragment();

    if (data.length > 0) {
      let contador = 1;
      data.forEach(cliente => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const td5 = document.createElement('td');
        const buttonModificar = document.createElement('button');
        const buttonEliminar = document.createElement('button');

        buttonModificar.classList.add('btn', 'btn-warning');
        buttonEliminar.classList.add('btn', 'btn-danger');
        buttonModificar.textContent = 'Modificar';
        buttonEliminar.textContent = 'Eliminar';

        buttonModificar.addEventListener('click', () => colocarDatosCliente(cliente));
        buttonEliminar.addEventListener('click', () => eliminarCliente(cliente.CLIENTE_ID));

        td1.innerText = contador;
        td2.innerText = cliente.CLIENTE_NOMBRE;
        td3.innerText = cliente.CLIENTE_NIT;

        td4.appendChild(buttonModificar);
        td5.appendChild(buttonEliminar);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        fragment.appendChild(tr);

        contador++;
      });
    } else {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.innerText = 'No existen registros';
      td.colSpan = 5;
      tr.appendChild(td);
      fragment.appendChild(tr);
    }

    tablaClientes.tBodies[0].appendChild(fragment);
  } catch (error) {
    console.log(error);
  }
};

const colocarDatosCliente = (datos) => {
  formularioClientes.cliente_nombre.value = datos.CLIENTE_NOMBRE;
  formularioClientes.cliente_nit.value = datos.CLIENTE_NIT;
  formularioClientes.cliente_id.value = datos.CLIENTE_ID;

  btnGuardarCliente.disabled = true;
  btnGuardarCliente.parentElement.style.display = 'none';
  btnBuscarCliente.disabled = true;
  btnBuscarCliente.parentElement.style.display = 'none';
  btnModificarCliente.disabled = false;
  btnModificarCliente.parentElement.style.display = '';
  btnCancelarAccion.disabled = false;
  btnCancelarAccion.parentElement.style.display = '';
  divTablaClientes.style.display = 'none';
};

const cancelarAccion = () => {
  formularioClientes.reset();
  btnGuardarCliente.disabled = false;
  btnGuardarCliente.parentElement.style.display = '';
  btnBuscarCliente.disabled = false;
  btnBuscarCliente.parentElement.style.display = '';
  btnModificarCliente.disabled = true;
  btnModificarCliente.parentElement.style.display = 'none';
  btnCancelarAccion.disabled = true;
  btnCancelarAccion.parentElement.style.display = 'none';
  divTablaClientes.style.display = '';
};

const modificarCliente = async () => {
  const cliente_id = formularioClientes.cliente_id.value;

  if (!cliente_id) {
    Swal.fire('Error', 'No se ha seleccionado ningún cliente para modificar.', 'error');
    return;
  }

  if (!validarFormulario(formularioClientes, ['cliente_nombre'])) {
    Swal.fire('Error', 'Debe llenar todos los campos.', 'error');
    return;
  }

  const body = new FormData(formularioClientes);
  body.append('tipo', 2);
  body.append('cliente_id', cliente_id);

  const url = '/franco_tarea6/controladores/clientes/index.php';
  const config = {
    method: 'POST',
    body,
  };

  try {
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    console.log(data);

    const { codigo, mensaje, detalle } = data;

    switch (codigo) {
      case 1:
        formularioClientes.reset();
        cancelarAccion();
        buscarClientes();

        Swal.fire('Actualizado', mensaje, 'success');
        break;

      case 0:
        Swal.fire('Error, verifique sus datos', mensaje, 'error');
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

const eliminarCliente = async (id) => {
  const result = await Swal.fire({
    title: '¿Desea eliminar este cliente?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    const url = `/franco_tarea6/controladores/clientes/index.php`;
    const body = new FormData();
    body.append('tipo', 3);
    body.append('cliente_id', id);
    const config = {
      method: 'POST',
      body,
    };

    try {
      const respuesta = await fetch(url, config);
      const data = await respuesta.json();
      const { codigo, mensaje } = data;

      switch (codigo) {
        case 1:
          buscarClientes();

          Swal.fire('Eliminado', mensaje, 'success');
          break;

        case 0:
          Swal.fire('Error', mensaje, 'error');
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
};

formularioClientes.addEventListener('submit', guardarCliente);
btnBuscarCliente.addEventListener('click', buscarClientes);
btnModificarCliente.addEventListener('click', modificarCliente);
btnCancelarAccion.addEventListener('click', cancelarAccion);
