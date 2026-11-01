import AuthService from '#services/auth_service'
import {
  changePasswordValidator,
  deleteAccountValidator,
  updateProfileValidator,
} from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AccountController {
  private authService = new AuthService()

  /**
   * PATCH /api/account
   */
  async update({ request, response, auth }: HttpContext) {
    const user = auth.use('web').getUserOrFail()
    const payload = await request.validateUsing(updateProfileValidator)
    const updated = await this.authService.updateProfile(user, payload)

    return response.json({
      success: true,
      message: 'Profil mis à jour',
      user: this.authService.toPublicUser(updated),
    })
  }

  /**
   * PUT /api/account/password
   */
  async changePassword({ request, response, auth }: HttpContext) {
    const user = auth.use('web').getUserOrFail()
    const { currentPassword, password } = await request.validateUsing(changePasswordValidator)
    const result = await this.authService.changePassword(user, currentPassword, password)

    if (!result.ok) {
      return response.status(400).json({
        success: false,
        message: 'Mot de passe actuel incorrect',
      })
    }

    return response.json({
      success: true,
      message: 'Mot de passe mis à jour',
    })
  }

  /**
   * DELETE /api/account
   */
  async destroy({ request, response, auth }: HttpContext) {
    const user = auth.use('web').getUserOrFail()
    const { password } = await request.validateUsing(deleteAccountValidator)
    const result = await this.authService.deleteAccount(user, password)

    if (!result.ok) {
      return response.status(400).json({
        success: false,
        message: 'Mot de passe incorrect',
      })
    }

    await auth.use('web').logout()

    return response.json({
      success: true,
      message: 'Compte supprimé',
    })
  }
}
