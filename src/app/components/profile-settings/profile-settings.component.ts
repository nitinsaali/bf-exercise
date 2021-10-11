import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from 'src/app/services/profile.service';
import { IProfile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject<any>();
  public form: FormGroup;
  public user: IProfile;
  public message: {
    show: boolean;
    message: string;
    class: string
  } = {
    show: false,
    message: '',
    class: ''
  }

  constructor(private fb: FormBuilder, 
      private profileService: ProfileService) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadProfile();
    this.clearMessage();
  }

  buildForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  /**********************************
   * Load Profile Details
   * ********************************/
  loadProfile() {
    this.form.disable();
    this.message = {
      show: true,
      message: 'Loading Profile',
      class: 'text-normal'
    }
    
    this.profileService.getProfileUser().then(response => {
      this.user = response;
      this.form.enable();
    }).catch(error => {
      this.message = {
        show: true,
        message: `Error! { ${error.error} }`,
        class: 'text-danger'
      }

      //setTimeout added just to see error message before calling loadProfile again
      setTimeout(() => this.loadProfile(), 2000);

      //without setTimeout we can call directly but we wont be seeing error message
      //this.loadProfile();
    });
  }

  /**********************************
   * Clear any messages on value changes
   * ********************************/
  clearMessage() {
    this.form.valueChanges.pipe(
      takeUntil(this.unsubscribe)
      ).subscribe(() => {
        this.message = {
          show: false,
          message: '',
          class: ''
        }
      });
  }

  /**********************************
   * Save method
   * ********************************/
  save() {
    this.message = {
      show: true,
      message: 'Saving Profile',
      class: 'text-success'
    }

    this.profileService.setName(this.form.value.firstName).then(response => {
      this.message = {
        show: false,
        message: '',
        class: ''
      }
      const email = `${this.form.value.firstName.trim()}.${this.form.value.lastName.trim()}@blueface.com`;

      this.profileService.setUserEmail(email)
      .then(response => {
        console.log(response);
      }).catch(err => {
        this.message = {
          show: true,
          message: `Error! { ${err.error} }`,
          class: 'text-danger'
        }

        setTimeout(() => this.form.reset(), 3000);
      })
    }).catch(error => {
      this.message = {
        show: true,
        message: `Error! { ${error.error} }`,
        class: 'text-danger'
      }
    })
  }

  /****
   * unsubscribe to avoid any memory leaks
   ****/
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}