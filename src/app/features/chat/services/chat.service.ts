import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  show_chat_window = signal<boolean>(false);
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
  ]);

  toggle_chat_window(state?: boolean) {
    this.show_chat_window.update((current) => state ?? !current);
  }

  send_message(message: string) {
    this.chat_messages.update((current) => [...current, { role: 'user', content: message }]);
  }
}
