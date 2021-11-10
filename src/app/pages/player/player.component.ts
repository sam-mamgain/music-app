import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { CloudService } from 'src/app/services/cloud.service';
import { StreamState } from 'src/app/interfaces/stream-state';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  constructor(
    private audioService: AudioService,
    private cloudService: CloudService
  ) {
    // get media files
    cloudService.getFiles().subscribe((files) => {
      this.files = files;
    });

    // listen to the stream state
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  files: { name: string; artist: string }[] = [
    { name: 'First song', artist: 'Inder' },
    { name: 'Second song', artist: 'You' },
  ];

  state: StreamState | undefined;
  currentFile: any = {};

  ngOnInit(): void {}

  playStream(url: string) {
    this.audioService.playStream(url).subscribe((events) => {});
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    if(typeof this.currentFile.index != 'number') return;
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    if(typeof this.currentFile.index != 'number') return;
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

  openFile(file: any, index: number) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.url);
  }
}
