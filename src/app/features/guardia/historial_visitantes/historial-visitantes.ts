import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DetalleModalComponent } from './detalle-modal';

export interface RegistroVisitante {
  id: number;
  fecha: string;
  entrada: string;
  salida: string;
  placa: string;
  visitante: string;
  iniciales: string;
  avatarColor: string;
  destino: string;
  tipo: 'Residente' | 'Visitante' | 'Delivery' | 'Servicios';
  estado: 'En Predio' | 'Finalizado' | 'Rechazado';
  documento: string;
}

@Component({
  selector: 'app-historial-visitantes',
  standalone: true,
  imports: [CommonModule, DetalleModalComponent],
  templateUrl: './historial-visitantes.html',
  styleUrls: ['./historial-visitantes.scss']
})
export class HistorialVisitantesComponent {
  readonly busqueda = signal('');
  readonly fechaSeleccionada = signal('');
  readonly tipoSeleccionado = signal('Todos');
  readonly estadoSeleccionado = signal('Todos');
  readonly pagina = signal(1);
  readonly registrosPorPagina = 10;

  readonly registros = signal<RegistroVisitante[]>([
    {
      id: 1,
      fecha: '2023-10-24',
      entrada: '14:30',
      salida: '--:--',
      placa: 'ABC-1234',
      visitante: 'Ricardo Mendoza',
      iniciales: 'RM',
      avatarColor: 'blue',
      destino: 'Torre A - 402',
      tipo: 'Visitante',
      estado: 'En Predio',
      documento: '1032456789'
    },
    {
      id: 2,
      fecha: '2023-10-24',
      entrada: '12:15',
      salida: '13:05',
      placa: 'XYZ-9876',
      visitante: 'Uber Eats - Juan P.',
      iniciales: 'U',
      avatarColor: 'gray',
      destino: 'Torre C - 105',
      tipo: 'Delivery',
      estado: 'Finalizado',
      documento: 'No registrado'
    },
    {
      id: 3,
      fecha: '2023-10-24',
      entrada: '10:00',
      salida: 'Denegado',
      placa: 'GHH-4455',
      visitante: 'Marcos Castillo',
      iniciales: 'MC',
      avatarColor: 'red',
      destino: 'Torre B - 202',
      tipo: 'Servicios',
      estado: 'Rechazado',
      documento: '1019876543'
    },
    {
      id: 4,
      fecha: '2023-10-23',
      entrada: '18:20',
      salida: '19:10',
      placa: 'KLM-987',
      visitante: 'Andrea Rojas',
      iniciales: 'AR',
      avatarColor: 'purple',
      destino: 'Torre D - 301',
      tipo: 'Residente',
      estado: 'Finalizado',
      documento: '52234567'
    },
    {
      id: 5,
      fecha: '2023-10-23',
      entrada: '17:05',
      salida: '--:--',
      placa: 'PQR-6789',
      visitante: 'Camilo Torres',
      iniciales: 'CT',
      avatarColor: 'green',
      destino: 'Torre A - 110',
      tipo: 'Visitante',
      estado: 'En Predio',
      documento: '79912345'
    },
    {
      id: 6,
      fecha: '2023-10-23',
      entrada: '15:40',
      salida: '16:12',
      placa: 'DEF-2468',
      visitante: 'Domicilios Express',
      iniciales: 'DE',
      avatarColor: 'gray',
      destino: 'Torre B - 501',
      tipo: 'Delivery',
      estado: 'Finalizado',
      documento: 'No registrado'
    },
    {
      id: 7,
      fecha: '2023-10-22',
      entrada: '11:30',
      salida: '12:00',
      placa: 'MNO-1122',
      visitante: 'Luis Herrera',
      iniciales: 'LH',
      avatarColor: 'blue',
      destino: 'Torre C - 204',
      tipo: 'Visitante',
      estado: 'Finalizado',
      documento: '80234567'
    },
    {
      id: 8,
      fecha: '2023-10-22',
      entrada: '09:15',
      salida: 'Denegado',
      placa: 'RST-3344',
      visitante: 'Jorge Pineda',
      iniciales: 'JP',
      avatarColor: 'red',
      destino: 'Torre A - 602',
      tipo: 'Servicios',
      estado: 'Rechazado',
      documento: '1003456789'
    },
    {
      id: 9,
      fecha: '2023-10-21',
      entrada: '08:50',
      salida: '09:22',
      placa: 'UVW-7788',
      visitante: 'Paula Gómez',
      iniciales: 'PG',
      avatarColor: 'purple',
      destino: 'Torre D - 102',
      tipo: 'Residente',
      estado: 'Finalizado',
      documento: '52123456'
    },
    {
      id: 10,
      fecha: '2023-10-21',
      entrada: '07:45',
      salida: '--:--',
      placa: 'BCD-5511',
      visitante: 'Felipe Díaz',
      iniciales: 'FD',
      avatarColor: 'green',
      destino: 'Torre C - 403',
      tipo: 'Visitante',
      estado: 'En Predio',
      documento: '1035678901'
    },
    {
      id: 11,
      fecha: '2023-10-20',
      entrada: '16:30',
      salida: '17:00',
      placa: 'EFG-2233',
      visitante: 'Mensajería Rápida',
      iniciales: 'MR',
      avatarColor: 'gray',
      destino: 'Torre B - 304',
      tipo: 'Delivery',
      estado: 'Finalizado',
      documento: 'No registrado'
    },
    {
      id: 12,
      fecha: '2023-10-20',
      entrada: '13:00',
      salida: 'Denegado',
      placa: 'HIJ-4455',
      visitante: 'Óscar Muñoz',
      iniciales: 'OM',
      avatarColor: 'red',
      destino: 'Torre A - 201',
      tipo: 'Servicios',
      estado: 'Rechazado',
      documento: '987654321'
    }
  ]);

  readonly registrosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const fecha = this.fechaSeleccionada();
    const tipo = this.tipoSeleccionado();
    const estado = this.estadoSeleccionado();

    return this.registros().filter(registro => {
      const coincideTexto =
        !texto ||
        registro.placa.toLowerCase().includes(texto) ||
        registro.visitante.toLowerCase().includes(texto) ||
        registro.documento.toLowerCase().includes(texto) ||
        registro.destino.toLowerCase().includes(texto);

      const coincideFecha = !fecha || registro.fecha === fecha;
      const coincideTipo = tipo === 'Todos' || registro.tipo === tipo;
      const coincideEstado =
        estado === 'Todos' || registro.estado === estado;

      return (
        coincideTexto &&
        coincideFecha &&
        coincideTipo &&
        coincideEstado
      );
    });
  });

  readonly totalPaginas = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.registrosFiltrados().length / this.registrosPorPagina
      )
    )
  );

  readonly registrosVisibles = computed(() => {
    const paginaActual = Math.min(this.pagina(), this.totalPaginas());
    const inicio = (paginaActual - 1) * this.registrosPorPagina;

    return this.registrosFiltrados().slice(
      inicio,
      inicio + this.registrosPorPagina
    );
  });

  readonly desde = computed(() =>
    this.registrosFiltrados().length === 0
      ? 0
      : (this.pagina() - 1) * this.registrosPorPagina + 1
  );

  readonly hasta = computed(() =>
    Math.min(
      this.pagina() * this.registrosPorPagina,
      this.registrosFiltrados().length
    )
  );

  readonly registroDetalle = signal<RegistroVisitante | null>(null);

  constructor(private readonly router: Router) {}

  cambiarBusqueda(valor: string): void {
    this.busqueda.set(valor);
    this.pagina.set(1);
  }

  cambiarFecha(valor: string): void {
    this.fechaSeleccionada.set(valor);
    this.pagina.set(1);
  }

  seleccionarTipo(tipo: string): void {
    this.tipoSeleccionado.set(tipo);
    this.pagina.set(1);
  }

  seleccionarEstado(estado: string): void {
    this.estadoSeleccionado.set(estado);
    this.pagina.set(1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.pagina.set(pagina);
    }
  }

  verDetalle(registro: RegistroVisitante): void {
    this.registroDetalle.set(registro);
  }

  cerrarDetalle(): void {
    this.registroDetalle.set(null);
  }

  exportarReporte(): void {
    const encabezados = [
      'Fecha',
      'Entrada',
      'Salida',
      'Placa',
      'Visitante',
      'Documento',
      'Destino',
      'Tipo',
      'Estado'
    ];

    const filas = this.registrosFiltrados().map(registro => [
      registro.fecha,
      registro.entrada,
      registro.salida,
      registro.placa,
      registro.visitante,
      registro.documento,
      registro.destino,
      registro.tipo,
      registro.estado
    ]);

    const csv = [encabezados, ...filas]
      .map(fila =>
        fila
          .map(valor =>
            '"' + String(valor).replace(/"/g, '""') + '"'
          )
          .join(',')
      )
      .join('\n');

    const archivo = new Blob(['\ufeff' + csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = 'historial-visitantes-safeflow.csv';
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
  }

  cerrarSesion(): void {
    this.router.navigate(['/auth']);
  }

  navegarA(seccion: string): void {
    if (seccion === 'Dashboard') {
      this.router.navigate(['/guardia']);
    } else if (seccion === 'Visitantes') {
      this.router.navigate(['/guardia/historial-visitantes']);
    } else if (seccion === 'Recaudos') {
      console.info('La ruta de Recaudos está pendiente de configurar.');
    }
  }
}
