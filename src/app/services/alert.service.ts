import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {}

  // Alerta de éxito
  success(message: string, title: string = '¡Proceso exitoso!') {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'text-white bg-green-600 rounded-lg px-4 py-2',
      },
      buttonsStyling: false,
      heightAuto: false
    });
  }

  // Alerta de error
  error(messages: any) {
    let msg;
    messages.forEach((m: any) => {
      msg = m.message;
    });

    Swal.fire({
      title: 'Ups, algo salio mal',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      customClass: {
        confirmButton:
          'text-white bg-red-500 rounded-lg px-3 py-2 text-center',
      },
      buttonsStyling: false,
      heightAuto: false,
    });
  }

  // Confirmación
  confirm(message: string, title: string = '¿Estás seguro?') {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'text-white bg-green-600 rounded-lg px-4 py-2',
        cancelButton: 'text-white bg-red-500 rounded-lg px-4 py-2'
      },
      buttonsStyling: false,
      heightAuto: false
    });
  }
}
