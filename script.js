// Elementos del DOM
const selectBanco = document.getElementById('selectBanco');
const inputTasa = document.getElementById('tasa');

// Sincronizar tasa cuando cambia el banco
selectBanco.addEventListener('change', () => {
  inputTasa.value = selectBanco.value;
});

// Función para formatear números como moneda chilena
function formatearMoneda(valor) {
  return Math.round(valor).toLocaleString('es-CL');
}

// Función para calcular la cuota mensual
function calcularCuota(monto, tasa, numeroCuotas) {
  if (tasa === 0) {
    return monto / numeroCuotas;
  }
  return monto * (tasa / (1 - Math.pow(1 + tasa, -numeroCuotas)));
}

// Función para construir la tabla de amortización
function construirAmortizacion(monto, tasa, numeroCuotas) {
  const cuota = calcularCuota(monto, tasa, numeroCuotas);
  const filas = [];
  let saldo = monto;
  
  // Fila inicial (mes 0)
  filas.push({
    numero: 0,
    cuota: 0,
    interes: 0,
    amortizacion: 0,
    saldo: Math.round(saldo)
  });
  
  // Generar filas para cada mes
  for (let mes = 1; mes <= numeroCuotas; mes++) {
    let interes = saldo * tasa;
    let amortizacion = cuota - interes;
    
    // Ajuste para la última cuota
    if (mes === numeroCuotas) {
      amortizacion = saldo;
    }
    
    let nuevoSaldo = saldo - amortizacion;
    
    filas.push({
      numero: mes,
      cuota: Math.round(cuota),
      interes: Math.round(interes),
      amortizacion: Math.round(amortizacion),
      saldo: Math.round(Math.max(0, nuevoSaldo))
    });
    
    saldo = nuevoSaldo;
  }
  
  return {
    pagoMensual: Math.round(cuota),
    amortizacion: filas
  };
}

// Evento del botón Calcular
document.getElementById('btnCalcular').addEventListener('click', () => {
  const monto = Number(document.getElementById('monto').value);
  const numeroCuotas = parseInt(document.getElementById('meses').value);
  const tasa = Number(document.getElementById('tasa').value);
  
  // Validación de datos
  if (monto <= 0 || numeroCuotas <= 0 || tasa < 0) {
    alert('Valores inválidos');
    return;
  }
  
  // Calcular amortización
  const datos = construirAmortizacion(monto, tasa, numeroCuotas);
  
  // Mostrar valor de la cuota
  document.getElementById('pagoMensual').textContent = formatearMoneda(datos.pagoMensual);
  
  // Generar tabla de amortización
  const cuerpoTabla = document.getElementById('cuerpoAmortizacion');
  cuerpoTabla.innerHTML = '';
  
  datos.amortizacion.forEach(fila => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="text-align:center">${fila.numero}</td>
      <td>${formatearMoneda(fila.cuota)}</td>
      <td>${formatearMoneda(fila.interes)}</td>
      <td>${formatearMoneda(fila.amortizacion)}</td>
      <td>${formatearMoneda(fila.saldo)}</td>
    `;
    cuerpoTabla.appendChild(tr);
  });
  
  // Scroll suave al resultado
  document.querySelectorAll('.card')[1].scrollIntoView({ 
    behavior: 'smooth', 
    block: 'nearest' 
  });
});

// Evento del botón Reset
document.getElementById('btnReset').addEventListener('click', () => {
  document.getElementById('monto').value = 4000000;
  document.getElementById('meses').value = 24;
  document.getElementById('tasa').value = 0.0098;
  selectBanco.selectedIndex = 1;
  document.getElementById('pagoMensual').textContent = '-';
  document.getElementById('cuerpoAmortizacion').innerHTML = '';
});
