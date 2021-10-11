import { Injectable } from '@angular/core';
import { IProfile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    public user: IProfile;
    constructor() { }
    getProfileUser(): Promise<IProfile> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.round(Math.random())) {
                    this.user = {
                        firstName: 'Michael',
                        lastName: 'Collins',
                        username: 'michael.collins',
                        email:'michael.collins@blueface.com', 
                        age: 30
                    };
                    resolve(this.user);
                } else {
                    reject({ error: 'Profile not found' });
                }
            }, Math.random() * 5000);
        });
    }
    setName(firstName: string) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.round(Math.random())) {
                    this.user.firstName = firstName;
                    resolve(this.user);
                } else {
                    reject({ error: 'Invalid name' });
                }
            }, Math.random() * 5000);
        });
    }

    setUserEmail(email: string) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.round(Math.random())) {
                    this.user.email = email;
                    resolve(this.user);
                } else {
                    reject({ error: 'Error on email generation' });
                }
            }, Math.random() * 5000);
        });
    }
}