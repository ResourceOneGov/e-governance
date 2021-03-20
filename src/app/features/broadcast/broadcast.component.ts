import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import Swal from 'sweetalert2';
import { Broadcast } from 'src/app/core/models/broadcast.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import * as AgoraRTM from 'agora-rtm-sdk';


@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {

  @Output() broadcastMessage: EventEmitter<any> = new EventEmitter();

  title = 'AgoraDemo';
  localStream: Stream;
  remoteCalls: any = []; 
  scheduledTime;
  isBroadcastStarted: boolean; 
  muteBtn: string ='Mute';
  count: number = 0;
  disableGoLive: boolean = true;
  scheduledBroadcast: Broadcast;
  isBroadCastScheduled: boolean;
  broadCastScheduledAt: string;
  secondsToMore: number;
  interval: any;
  client: any;
  channel: any;
  
  constructor(private agoraService: AngularAgoraRtcService, private broadcastService: BroadcastService,
               private snackBar: MatSnackBar) {
    this.agoraService.createClient();
    this.client = AgoraRTM.createInstance('31c5688ef4a14676986b13acafacd33d');
    
  }

  ngOnInit(){  
    this.broadcastService.listen().subscribe(message => {
      console.log('message inside the broadcast', message);
      this.getBroadCastDetails();
    });
    this.getBroadCastDetails(); 
  }

  getBroadCastDetails() {
    this.secondsToMore = 0;
    this.broadcastService.getBroadCast().subscribe(res => {
      console.log('res', res);
      this.scheduledBroadcast = res;
      if(this.scheduledBroadcast.hasNextScheduledBroadcast) {      
        this.isBroadCastScheduled = true;
        let days = moment(res.scheduledAt).diff(moment(), 'days');
        console.log('days', days);
        if(days >= 1) {
          this.broadCastScheduledAt = `at ${moment(res.scheduledAt).format('lll')}`;
          this.secondsToMore = 0;
        } else {
          this.secondsToMore = moment(res.scheduledAt).diff(moment(), 'seconds');
          console.log('this.secondsToMore', this.secondsToMore);
          
          // if(this.secondsToMore < -601) {
          //   console.log('secondstoMte', this.secondsToMore);
          //   this.isBroadCastScheduled = false;
          // }
        }
        this.scheduledTime = moment(res.scheduledAt).format('lll');
        console.log('this.scheduledTime', this.secondsToMore);
      } else {
        this.isBroadCastScheduled = false;
      }
    });
  }

  notifyEvent(e) {
    if(e.action === "done") {
      this.secondsToMore = -1;
      // this.timeOut(600);
    }
  }

  ngOnDestroy() {
    if(this.isBroadcastStarted) {
      this.stopBroadCasting('auto');
    }
    if(this.interval) {
      clearInterval(this.interval);
    }  
  }

  startBroadCasting() {
    console.log('broadcast started', this.isBroadcastStarted);
    this.muteBtn = 'Mute';
    this.agoraService.client.join(null, 'resourceone', 1, (uid) => {
      console.log('count check in start broadcasting', uid);
      this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
    
      this.localStream.setVideoProfile('480p_1');
      this.subscribeToStreams();
      this.isBroadcastStarted = true;
      this.broadcastService.broadCastTrigger('started');
      this.joinChannel('resourceone');
    });
  }

  joinChannel (name) {
    console.log('joinChannel', name);
    this.client.login({ uid: "accountName", token: null }).then(() => {
      console.log('AgoraRTM client login success');
      this.channel = this.client.createChannel(name);
      this.channel.join().then(() => {
        console.log('Channel joined!');
      }).catch(error => {
        console.log('Channel join failed.');
      });
      this.subscribeChannelEvents();
      // return channel.join();
    }).catch(err => {
      console.log('AgoraRTM client login failure', err);
    });  
  }

  subscribeChannelEvents() {
    this.channel.on('MemberJoined', (...args)=> {
      console.log('member joined', args);
    });

    this.interval = setInterval(() => {
      this.client.getChannelMemberCount(["resourceone"]).then(res => {
        console.log('count',res);
        this.count = res.resourceone;
      });
    }, 5000);
  }

  

  stopBroadCasting(status) {
    if(status === 'auto') {
      this.localStream.stop();
      this.localStream.close();
      this.isBroadcastStarted = false;
      this.deleteBroadcast();
    } else if(status === 'manual') {
      Swal.fire({
        title: 'End Broadcast!',
        text: "Are you sure you want to end the current broadcast?",
        // icon: 'warning',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, End Broadcast!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          this.localStream.stop();
          this.localStream.close();
          this.isBroadcastStarted = false;
          this.deleteBroadcast();
          // this.agoraService.client.stopLiveStreaming();
          this.agoraService.client.leave(() => {
            console.log("Leavel channel successfully");
          }, (err) => {
            console.log("Leave channel failed");
          });
        } 
      })
    }
    
    
  }

  deleteBroadcast() {
    console.log('delete Broadcast', this.scheduledBroadcast);
    this.broadcastService.deleteBroadcast(this.scheduledBroadcast._id).subscribe(res => {
      this.snackBar.open("Broadcast Ended Successfully", "OK", {
        duration: 2000,
      });
      this.scheduledBroadcast = null;
      this.broadcastService.broadCastTrigger('Delete');
      this.channel.leave();
      if(this.interval) {
        clearInterval(this.interval);
      }  
      this.client.logout().then(()=>{console.log("Client logged out.")})
        .catch(()=>{console.log("log out failed")});
    });
  }

  muteOrUnmuteBroadCasting() {
    if(this.muteBtn === 'Mute') {
      this.localStream.muteAudio();
      this.muteBtn = 'Unmute';
    } else if(this.muteBtn === 'Unmute') {
      this.localStream.unmuteAudio();
      this.muteBtn = 'Mute';
    }
  }

  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });

    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });

    // Add
    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });

    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });

    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });

    this.agoraService.client.on('peer-online', (evt) => {
      console.log('count check peer-online');
      console.log(`${evt.uid} joined this channel`);
    });

    this.agoraService.client.on('stream-added', (evt) => {
      console.log('count check stream-added');
      console.log(`${evt.uid} joined this channel`);
    });

    // this.interval = setInterval(() => {
    //   this.agoraService.client.getRemoteVideoStats((stats)=> {
    //     console.log('stats object', stats)
    //   });
    // }, 1000);

    console.log('agora service', this.agoraService, this.localStream, this.agoraService.client);
  }
}



