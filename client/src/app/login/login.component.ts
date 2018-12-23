import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

interface IUser {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    user: IUser;

    constructor(private socketService: SocketService, private router: Router, private cookie: CookieService) { }

    ngOnInit() {
        this.user = { userName: null, password: null };

        this.socketService.init();

        this.socketService.on('unauthorized', () => {
            console.log('Unauthorized');
        });

        this.socketService.on('authorized', data => {
            this.cookie.set('token', data.token);
            this.router.navigateByUrl('home');
        });

        this.socketService.on('connect', () => {
            console.log('Connected');
        });
    }

    login() {
        if (!this.user.userName) {
            return;
        }

        if (!this.user.password) {
            return;
        }

        this.socketService.emit('login', this.user);
    }
}
