import { createHash, randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import MailService from '#services/mail_service'

const RESET_TOKEN_TTL_MINUTES = 60

export type PublicUser = {
  id: number
  email: string
  fullName: string | null
}

export default class AuthService {
  private mail = new MailService()

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    }
  }

  async register(payload: { name: string; email: string; password: string }) {
    const user = await User.create({
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
    })

    return user
  }

  async attemptLogin(email: string, password: string) {
    return User.verifyCredentials(email, password)
  }

  async updateProfile(user: User, payload: { name: string }) {
    user.fullName = payload.name
    await user.save()
    return user
  }

  async changePassword(user: User, currentPassword: string, newPassword: string) {
    const valid = await hash.verify(user.password, currentPassword)
    if (!valid) {
      return { ok: false as const, reason: 'invalid_current' as const }
    }

    user.password = newPassword
    await user.save()
    return { ok: true as const }
  }

  async deleteAccount(user: User, password: string) {
    const valid = await hash.verify(user.password, password)
    if (!valid) {
      return { ok: false as const, reason: 'invalid_password' as const }
    }

    await user.delete()
    return { ok: true as const }
  }

  async requestPasswordReset(email: string) {
    const user = await User.findBy('email', email)

    /**
     * Toujours répondre success côté API pour ne pas révéler
     * si l'email existe.
     */
    if (!user) {
      return
    }

    const token = randomBytes(32).toString('hex')
    const tokenHash = this.hashToken(token)

    await db.from('password_reset_tokens').where('email', email).delete()
    await db.table('password_reset_tokens').insert({
      email,
      token: tokenHash,
      expires_at: DateTime.now().plus({ minutes: RESET_TOKEN_TTL_MINUTES }).toSQL(),
      created_at: DateTime.now().toSQL(),
    })

    await this.mail.sendPasswordReset(email, token)
  }

  async resetPassword(token: string, password: string) {
    const tokenHash = this.hashToken(token)
    const row = await db
      .from('password_reset_tokens')
      .where('token', tokenHash)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!row) {
      return { ok: false as const, reason: 'invalid_token' as const }
    }

    const user = await User.findBy('email', row.email)
    if (!user) {
      await db.from('password_reset_tokens').where('token', tokenHash).delete()
      return { ok: false as const, reason: 'invalid_token' as const }
    }

    user.password = password
    await user.save()
    await db.from('password_reset_tokens').where('email', row.email).delete()

    return { ok: true as const }
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex')
  }
}
