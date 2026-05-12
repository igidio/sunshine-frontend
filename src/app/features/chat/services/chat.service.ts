import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  http_client = inject(HttpClient);
  show_chat_window = signal<boolean>(false);
  assistant_typing = signal<boolean>(false);
  last_message = signal<{ content: string; has_failed: boolean } | null>(null);
  chat_messages = signal<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
    {
      role: 'assistant',
      content: 'Hola, soy tu asistente inteligente',
    },
    {
      role: 'user',
      content: '¡Hola! ¿Cómo estás?',
    },
    {
      role: 'assistant',
      content: 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte hoy?',
    },
    {
      role: 'user',
      content: '¿Puedes darme un resumen de las últimas noticias?',
    },
    {
      role: 'assistant',
      content: 'Claro, aquí tienes un resumen de las últimas noticias: ...',
    },
    {
      role: 'user',
      content: '¡Gracias! ¿Puedes recomendarme una película para ver esta noche?',
    },
  ]);

  toggle_chat_window(state?: boolean) {
    this.show_chat_window.update((current) => state ?? !current);
  }

  send_message(message: string) {
    this.last_message.set({ content: message, has_failed: false });

    this.assistant_typing.set(true);

    return this.http_client
      .post('/api/chat', { message }, {})
      .pipe(
        catchError((error) => {
          this.last_message.set({ content: message, has_failed: true });
          this.assistant_typing.set(false);
          throw error;
        }),
        finalize(() => {
          this.assistant_typing.set(false);
        }),
      )
      .subscribe((response: any) => {
        this.last_message.set(null);
        this.chat_messages.update((current) => [...current, { role: 'user', content: message }]);
        this.chat_messages.update((current) => [
          ...current,
          { role: 'assistant', content: response.reply },
        ]);
        localStorage.setItem('chat_messages', JSON.stringify(this.chat_messages()));
      });
  }

  get_messages() {
    const messages_from_local_storage = localStorage.getItem('chat_messages');
    this.chat_messages.update((current) =>
      messages_from_local_storage ? JSON.parse(messages_from_local_storage) : [],
    );
  }

  constructor() {
    //this.get_messages();
  }
}
