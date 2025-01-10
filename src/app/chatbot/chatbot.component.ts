import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConversationComponent } from '../conversation/conversation.component';
import { MatIconModule } from '@angular/material/icon';
import { PromptComponent } from './app-prompt/prompt.component';
import { ChatBotService } from './chatbot-service';
import { HttpClientModule } from '@angular/common/http';
import { IConversationMessage } from '../interfaces/conversation-message';


import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from "@angular/flex-layout";


@Component({
  selector: 'app-chatbot',
  imports: [CommonModule,
    HttpClientModule,
    ConversationComponent,
    PromptComponent,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    FlexLayoutModule],
  standalone: true,
  providers: [ChatBotService],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  public messages: IConversationMessage[] = [];
  chatboxOpen: boolean = true;

  constructor(private chatBotService: ChatBotService) {}

  ngOnInit() {
    this.messages = this.chatBotService.messages;
  }

  toggleChatbox() {
    this.chatboxOpen = !this.chatboxOpen;
  }

  handlePromptChange($event: any) {
    this.messages.push({
      from: 'user',
      text: $event
    });
    this.chatBotService.submitPrompt($event).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.messages.push({
            from: 'bot',
            text: res.choices[0].text.trim()
          })}, 500);
      },
      error: (err) => {
        setTimeout(() => {
          this.messages.push({
            from: 'bot',
            text: err.error?.error?.message
          });
        }, 500);
    }});
  }
}
