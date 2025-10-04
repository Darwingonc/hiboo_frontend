import {Component, inject, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {DedicationService} from '../../services/dedication.service';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-dedication',
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule,
  ],
  templateUrl: './dedication.component.html',
  styleUrls: ['./dedication.component.css']
})
export class DedicationComponent implements OnInit {

  private dedicationService = inject(DedicationService);
  private alertsService = inject(AlertService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  dedication: any = null;
  business: any = null;
  loading: boolean = true;

  uuid: any | null = null;
  qrId = 'abc123';
  data: any;

  mensaje = '';
  link = '';
  remitente = '';


  platformLinkHTML = '';

  ngOnInit(): void {
    this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.getDataOfDedication(this.uuid);
  }

  getDataOfDedication(uuid: any) {
    this.loading = true;
    this.dedicationService.getDedicationByUuid(uuid).subscribe({
      next: (res) => {
        const dedication = res.dedication;
        // Verificar expiracioon
        if (dedication.expires_at) {
          const now = new Date();
          const expiresAt = new Date(dedication.expires_at);
          if (expiresAt < now) {
            this.loading = false;
            this.router.navigate(['/expired']);
            return;
          }
        }
        this.dedication = dedication;
        this.business = dedication.Business;
        this.preparePlatformLink(this.dedication.media_url);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.router.navigate(['error']);
      }
    });
  }

  guardar() {
    this.loading = true;

    const formData = new FormData();
    formData.append("dedication_uuid", this.uuid);
    formData.append("media_url", this.link || "");
    formData.append("message", this.mensaje || "");
    formData.append("sender_name", this.remitente || "");
    formData.append("status", "completed");

    if (this.recordedBlob) {
      formData.append("audio_url", this.recordedBlob, "grabacion.webm");
    }

    this.alertsService.confirm(
      '¡Antes de enviar tu dedicatoria, revisa bien la información porque no podrás actualizarlo en el futuro!', 'Recibido'
    ).then(
      result => {
        if(result.isConfirmed){
          this.dedicationService.updateDedication(formData).subscribe({
            next: data => {
              this.alertsService.success(data.message).then(res => {
                if (res.isConfirmed) {
                  window.location.reload()
                }
              });
            },
            error: err => {
              this.alertsService.error(err.error.errors);
              this.loading = false;
            }
          })
        }
      }
    )
  }


  preparePlatformLink(media_url?: string) {
    if (!media_url) return;

    const baseClasses = `
    inline-flex items-center gap-2 px-4 py-2
    rounded-lg font-medium text-white shadow-md
    transition-all duration-200 transform hover:-translate-y-1
    hover:shadow-xl
  `;

    if (media_url.includes('youtube.com') || media_url.includes('youtu.be')) {
      this.platformLinkHTML = `
      <a class="${baseClasses} bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
         href="${media_url}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="22">
        Ver en YouTube
      </a>
    `;
    } else if (media_url.includes('spotify.com')) {
      this.platformLinkHTML = `
      <a class="${baseClasses} bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
         href="${media_url}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111624.png" width="22">
        Escuchar en Spotify
      </a>
    `;
    } else {
      this.platformLinkHTML = `
      <a class="${baseClasses} bg-gray-400 hover:bg-gray-500"
         href="${media_url}" target="_blank">
        🔗 Ver enlace
      </a>
    `;
    }
  }



  isRecording = false;
  recordingTime = 0;
  recordingInterval: any;
  audioURL: string | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: BlobPart[] = [];
  recordedBlob: Blob | null = null;

  async toggleRecording() {
    if (!this.isRecording) {
      await this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  async startRecording() {
    try {
      this.isRecording = true;
      this.recordingTime = 0;
      this.audioChunks = [];
      this.audioURL = null;

      // Contador
      this.recordingInterval = setInterval(() => this.recordingTime++, 1000);

      // Acceso al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        this.recordedBlob = audioBlob;

        // Forzar actualización de Angular
        this.ngZone.run(() => {
          this.audioURL = url;
        });

        // Detener el stream
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
    } catch (err) {
      this.alertsService.error([{ message: "No se pudo acceder al micrófono. Por favor, verifica los permisos." }]);
      this.isRecording = false;
      clearInterval(this.recordingInterval);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      clearInterval(this.recordingInterval);
      this.isRecording = false;
      this.mediaRecorder.stop();
    }
  }

  borrarAudio() {
    this.audioURL = null;
    this.recordedBlob = null;
  }

}
