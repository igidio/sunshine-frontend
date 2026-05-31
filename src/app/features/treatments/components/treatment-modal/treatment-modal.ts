import { ChangeDetectionStrategy, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { TreatmentService } from '../../services/treatment.service';
import { TreatmentInterface } from '../../interfaces/treatment.interface';
import { ModalService } from '@/app/shared/services/modal.service';

@Component({
  selector: 'treatment-modal',
  imports: [],
  templateUrl: './treatment-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentModal {
  treatmentService = inject(TreatmentService);
  modalService = inject(ModalService);
  template_delete_content = viewChild.required<TemplateRef<any>>('delete_content');
  template_disable_content = viewChild.required<TemplateRef<any>>('disable_content');

  get selected_treatment(): TreatmentInterface | null {
    return this.treatmentService.selected_treatment();
  }

  open_delete_modal(treatment: TreatmentInterface) {
    this.treatmentService.selected_treatment.set(treatment);
    this.modalService.set_header({
      title: 'Eliminar servicio',
      show_close_button: true,
    });
    this.modalService.set_content(this.template_delete_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: 'Eliminar',
          variant: 'danger',
          size: 'md',
          action: async () => {
            await this.treatmentService.delete(treatment.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }

  open_disable_modal(treatment: TreatmentInterface) {
    this.treatmentService.selected_treatment.set(treatment);
    this.modalService.set_header({
      title: `${treatment.disabled_at ? 'Habilitar' : 'Inhabilitar'} servicio`,
      show_close_button: true,
    });
    this.modalService.set_content(this.template_disable_content());
    this.modalService.set_footer({
      right_buttons: [
        {
          label: 'Cancelar',
          variant: 'secondary',
          size: 'md',
          action: () => {
            this.modalService.close();
          },
        },
        {
          label: treatment.disabled_at ? 'Habilitar' : 'Inhabilitar',
          variant: treatment.disabled_at ? 'success' : 'danger',
          size: 'md',
          action: async () => {
            await this.treatmentService.disable(treatment.id);
            this.modalService.close();
          },
        },
      ],
    });
    this.modalService.open();
  }
}
