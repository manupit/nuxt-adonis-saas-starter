import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware — session `web` par défaut, réponse JSON 401 pour l'API.
 */
export default class AuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards ?? ['web'])
      return next()
    } catch {
      return ctx.response.status(401).json({
        success: false,
        message: 'Non authentifié',
      })
    }
  }
}
