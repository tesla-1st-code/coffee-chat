import { Injectable } from '@angular/core';
import { ProgressHttp } from 'angular-progress-http';
import { SharedService } from './shared.service';

import  * as io from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private _socketUrl;
    private socket;
    
    constructor(private _http: ProgressHttp, private _cookie: CookieService, private _sharedService: SharedService) { 
        this._sharedService.getConfig(false).subscribe(config => {
            this._socketUrl = config.socketUrl;
        });
    }

    init() {
        this.socket = io(this._socketUrl + '?auth=' + this._cookie.get('token'));
    }

    on(name: string, callback) {
        this.socket.on(name, callback);
    }

    emit(name: string, callback): any {
        this.socket.emit(name, callback);
    }
}