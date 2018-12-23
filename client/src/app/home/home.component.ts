import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    contacts: any[] = [];

    constructor(private socketService: SocketService) { }

    ngOnInit() {
        this.socketService.init();
        this.socketService.emit('getContacts', {});

        this.socketService.on('setContacts', data => {
            this.contacts = data;
        });
    }
}
