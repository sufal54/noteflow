import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('about')
  about() {
    return {
      name: 'Your Name',
      email: 'your@email.com',
      'my features': {
        'Soft Delete': 'Prevents accidental note loss like Google Keep',
      },
    };
  }
}
