import AuthService from '#services/auth_service'
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
} from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  private authService = new AuthService()

  /**
   * POST /api/auth/register
   */
  async register({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await this.authService.register(payload)

    await auth.use('web').login(user)

    return response.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      user: this.authService.toPublicUser(user),
    })
  }

  /**
   * POST /api/auth/login
   */
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await this.authService.attemptLogin(email, password)
      await auth.use('web').login(user)

      return response.json({
        success: true,
        message: 'Connexion réussie',
        user: this.authService.toPublicUser(user),
      })
    } catch {
      return response.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      })
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  }

  /**
   * GET /api/auth/me
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.use('web').getUserOrFail()

    return response.json({
      success: true,
      user: this.authService.toPublicUser(user),
    })
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(forgotPasswordValidator)
    await this.authService.requestPasswordReset(email)

    return response.json({
      success: true,
      message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.',
    })
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword({ request, response }: HttpContext) {
    const { token, password } = await request.validateUsing(resetPasswordValidator)
    const result = await this.authService.resetPassword(token, password)

    if (!result.ok) {
      return response.status(400).json({
        success: false,
        message: 'Lien de réinitialisation invalide ou expiré',
      })
    }

    return response.json({
      success: true,
      message: 'Mot de passe mis à jour',
    })
  }
}
