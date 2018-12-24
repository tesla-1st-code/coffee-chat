import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

enum State {
    List,
    Search,
    Rooms,
    FR
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    state = State;
    currentState: State = State.List;
    contactQuery: string;
    contacts: any[] = [];
    contact: any;

    constructor(private socket: SocketService, private router: Router) { }

    ngOnInit() {
        this.socket.init();

        this.socket.emit('authorize', {});

        this.socket.on('unauthorized', () => {
            this.router.navigateByUrl('login');
        });
    }

    changeTab(state: State) {
        this.currentState = state;
        return false;
    }

    search() {
        if (!this.contactQuery || this.contactQuery === '') {
            return;
        }

        this.socket.emit('findContact', {query: this.contactQuery});
        
        this.socket.on('result-contact', data => {
            this.contact = data;
            this.currentState = State.Search;
        });
    }

    sendRequest() {
        if (!this.contact) {
            return;
        }

        this.socket.emit('send-request', this.contact);

        this.socket.on('request-feed', data => {
            this.currentState = State.List;
        });
    }
}
