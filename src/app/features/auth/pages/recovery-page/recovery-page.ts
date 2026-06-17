import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecoveryForm } from '../../components/recovery-form/recovery-form';
import { UiCard } from '@/app/shared/ui/ui-card/ui-card';

@Component({
  selector: 'recovery-page',
  imports: [RecoveryForm, UiCard],
  templateUrl: './recovery-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RecoveryPage { }
