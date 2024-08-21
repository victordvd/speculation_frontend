import $ from 'jquery';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export class WebSocketUtil {
    cnnBtnId = '#socketConnBtn'
    discnnBtnId = '#socketDisconnBtn'
    sendBtnId = '#socketSendBtn'
    msgTxtId = '#msgTxt'
    txtAreaId = '#txtArea'

    stompClient:any = null
    msgTxt = 'msgToSend'

    home:any = null
    
    constructor(home:any){
        this.home = home

        $("form").on('submit', function (e) {
            e.preventDefault();
        });
        $(this.cnnBtnId).click(()=>{ this.connect() });
        $(this.discnnBtnId).click(()=>{ this.disconnect(); });
        $(this.sendBtnId).click(()=>{ this.sendMsg();});
        
    }

    setConnected(subscribed:boolean) {
        $(this.cnnBtnId).prop("disabled", subscribed);
        $(this.discnnBtnId).prop("disabled", !subscribed);
        if (subscribed) {
            $(this.txtAreaId).show();
        }
        else {
            $(this.txtAreaId).hide();
        }
        // $("#greetings").html("");
    }

    sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async fetchTxoData(interval=2000) {
        while($('#socketConnBtn').prop('disabled')){
            let contractWeek:string = this.home.contractWeekCombo.current.state.value;
            console.log('Contract: '+contractWeek)
            // this.stompClient.send("/app/subscriptTxo", {}, JSON.stringify({'contractWeek': contractWeek}));
            this.stompClient.send("/app/subscriptTxo", {}, contractWeek);

            await this.sleep(interval);
        }
    }

    connect = ()=>{
        let socket = new SockJS('/opsimulator/stomp-endpoint');
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = function(){}
        this.stompClient.connect({}, (frame:any)=> {
            this.setConnected(true);
            console.log('Connected: ' + frame);
            this.stompClient.subscribe('/topic/txoPrice', (msg:any)=> {
                this.showResp(JSON.parse(msg.body));
            });

            this.fetchTxoData()
        });
    }
    
    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        this.setConnected(false);
        console.log("Disconnected from WS");
    }
    
    sendMsg() {

        $(this.msgTxtId).val('');
    }
    
    showResp(data:any) {
        this.home.renderTxoData(this.home, data)
        // $(this.txtAreaId).append("<tr><td>" + message.content + "</td></tr>");
    }

}