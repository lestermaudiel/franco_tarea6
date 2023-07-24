const formulario = document.querySelector('form')
const btnBuscar = document.getElementById('btnBuscar');
const btnModificar = document.getElementById('btnModificar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const divTabla = document.getElementById('divTabla');

btnModificar.disabled = true
btnModificar.parentElement.style.display = 'none'
btnCancelar.disabled = true
btnCancelar.parentElement.style.display = 'none'

const guardar = async (evento) => {
  evento.preventDefault();
  if (!validarFormulario(formulario, ['cliente_id'])) {
    Swal.fire('Error', 'Debe llenar todos los campos', 'error');
    return;
  }

  const body = new FormData(formulario);
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
        formulario.reset();
        buscar();

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

const buscar = async () => {

  let cliente_nombre = formulario.cliente_nombre.value;
  let cliente_nit = formulario.cliente_nit.value;
  const url = `/franco_tarea6/controladores/clientes/index.php?cliente_nombre=${cliente_nombre}&cliente_nit=${cliente_nit}`;
  const config = {
    method: 'GET'
  }

  try {
    const respuesta = await fetch(url, config)
    const data = await respuesta.json();

    tablaProductos.tBodies[0].innerHTML = ''
    const fragment = document.createDocumentFragment();
    console.log(data);

    if (data.length > 0) {
      let contador = 1;
      data.forEach(cliente => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td')
        const td2 = document.createElement('td')
        const td3 = document.createElement('td')
        const td4 = document.createElement('td')
        const td5 = document.createElement('td')
        const buttonModificar = document.createElement('button')
        const buttonEliminar = document.createElement('button')

        
        buttonModificar.classList.add('btn', 'btn-warning')
        buttonEliminar.classList.add('btn', 'btn-danger')
        buttonModificar.textContent = 'Modificar'
        buttonEliminar.textContent = 'Eliminar'

        buttonModificar.addEventListener('click', () => colocarDatos(cliente))
        buttonEliminar.addEventListener('click', () => eliminar(cliente.CLIENTE_ID))

        td1.innerText = contador;
        td2.innerText = cliente.CLIENTE_NOMBRE
        td3.innerText = cliente.CLIENTE_NIT

        td4.appendChild(buttonModificar)
        td5.appendChild(buttonEliminar)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)

        fragment.appendChild(tr);

        contador++;
      })
    } else {
      const tr = document.createElement('tr');
      const td = document.createElement('td')
      td.innerText = 'No existen registros'
      td.colSpan = 5
      tr.appendChild(td)
      fragment.appendChild(tr);
    }

    tablaProductos.tBodies[0].appendChild(fragment)
  } catch (error) {
    console.log(error);
  }
}

const colocarDatos = (datos) => {
  console.log(datos)
  formulario.cliente_nombre.value = datos.CLIENTE_NOMBRE
  formulario.cliente_nit.value = datos.CLIENTE_NIT
  formulario.cliente_id.value = datos.CLIENTE_ID

  btnGuardar.disabled = true
  btnGuardar.parentElement.style.display = 'none'
  btnBuscar.disabled = true
  btnBuscar.parentElement.style.display = 'none'
  btnModificar.disabled = false
  btnModificar.parentElement.style.display = ''
  btnCancelar.disabled = false
  btnCancelar.parentElement.style.display = ''
  divTabla.style.display = 'none'
}

const cancelarAccion = () => {
  btnGuardar.disabled = false
  btnGuardar.parentElement.style.display = ''
  btnBuscar.disabled = false
  btnBuscar.parentElement.style.display = ''
  btnModificar.disabled = true
  btnModificar.parentElement.style.display = 'none'
  btnCancelar.disabled = true
  btnCancelar.parentElement.style.display = 'none'
  divTabla.style.display = ''
}

const modificar = async () => {
  const cliente_id = formulario.cliente_id.value;

  if (!cliente_id) {
    Swal.fire('Error', 'No se ha seleccionado ningún cliente para modificar.', 'error');
    return;
  }

  if (!validarFormulario(formulario, ['cliente_nombre'])) {
    Swal.fire('Error', 'Debe llenar todos los campos.', 'error');
    return;
  }

  const body = new FormData(formulario);
  body.append('tipo', 2);
  body.append('cliente_id', cliente_id)

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
        formulario.reset();
        cancelarAccion();
        buscar();

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

const eliminar = async (id) => {

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
          buscar();


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

buscar();

formulario.addEventListener('submit', guardar);
btnBuscar.addEventListener('click', buscar);
btnModificar.addEventListener('click', modificar);
btnCancelar.addEventListener('click', cancelarAccion)