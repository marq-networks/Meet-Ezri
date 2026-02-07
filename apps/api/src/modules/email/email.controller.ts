import { FastifyReply, FastifyRequest } from 'fastify';
import { emailService } from './email.service';
import { sendEmailSchema, SendEmailInput } from './email.schema';

export async function sendEmailHandler(
  request: FastifyRequest<{ Body: SendEmailInput }>,
  reply: FastifyReply
) {
  try {
    // Manual validation
    const body = sendEmailSchema.parse(request.body);
    const { to, subject, html, text } = body;

    const info = await emailService.sendEmail(to, subject, html, text);
    return reply.code(200).send({ success: true, messageId: info.messageId });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return reply.code(400).send({ 
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        details: error.errors 
      });
    }
    
    request.log.error({ error }, 'Failed to send email');
    return reply.code(500).send({ message: 'Failed to send email', error: error.message });
  }
}
