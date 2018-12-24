import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

interface IRegister {
  userName: string;
  password: string;
  displayName: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    data: IRegister;

    constructor(private socketService: SocketService, private router: Router) { }

    ngOnInit() {
       this.data = { userName: null, password: null, displayName: null };
       this.socketService.init();
    }

    register() {
        if (!this.data.userName) {
            return;
        }

        if (!this.data.password) {
            return;
        }

        if (!this.data.displayName) {
            return;
        }

        this.socketService.emit('register', this.data);

        this.socketService.on('register-success', data => {
            this.router.navigateByUrl('/login');
        });
    }
}
