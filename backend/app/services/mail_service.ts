import env from '#start/env'
import logger from '@adonisjs/core/services/logger'

/**
 * Abstraction légère pour l'envoi d'emails.
 * En développement, les liens sont loggés dans la console.
 * Remplace ce service par Resend / SMTP plus tard sans toucher aux controllers.
 */
export default class MailService {
  async sendPasswordReset(email: string, token: string) {
    const frontendUrl = env.get('FRONTEND_URL')
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${encodeURIComponent(token)}`

    logger.info(
      {
        to: email,
        resetUrl,
      },
      '[mail] Password reset link (dev console mailer)'
    )
  }
}
