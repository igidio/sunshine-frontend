import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignupForm } from '../../components/signup-form/signup-form';
import { UiCard } from "@/app/shared/ui/ui-card/ui-card";

@Component({
  selector: 'signup-page',
  imports: [SignupForm, UiCard],
  templateUrl: './signup-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignupPage { }
