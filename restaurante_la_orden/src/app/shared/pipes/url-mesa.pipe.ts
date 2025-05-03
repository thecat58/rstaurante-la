import { inject, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { MesaModel } from '@shared/models/mesa.model';

@Pipe({
  name: 'urlMesa'
})
export class UrlMesaPipe implements PipeTransform {
 private router = inject(Router);

 transform(mesa: MesaModel): string {
  const serverIp = '192.168.1.1:4200'; // Reemplaza con la IP de tu servidor
  const urlTree = this.router.createUrlTree([`/mesa/${mesa.id_mesa}/menu`]);
  return `http://${serverIp}` + urlTree.toString(); // Construir la URL con la IP
}

}
