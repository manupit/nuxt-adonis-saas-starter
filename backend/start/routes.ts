/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/', () => {
  return { hello: 'world' }
})

// Auth publique
router
  .group(() => {
    router.post('/register', [() => import('#controllers/auth_controller'), 'register'])
    router.post('/login', [() => import('#controllers/auth_controller'), 'login'])
    router.post('/forgot-password', [
      () => import('#controllers/auth_controller'),
      'forgotPassword',
    ])
    router.post('/reset-password', [() => import('#controllers/auth_controller'), 'resetPassword'])
  })
  .prefix('/api/auth')

// Auth protégée (session)
router
  .group(() => {
    router.post('/logout', [() => import('#controllers/auth_controller'), 'logout'])
    router.get('/me', [() => import('#controllers/auth_controller'), 'me'])
  })
  .prefix('/api/auth')
  .use(middleware.auth())

// Compte (session)
router
  .group(() => {
    router.patch('/', [() => import('#controllers/account_controller'), 'update'])
    router.put('/password', [() => import('#controllers/account_controller'), 'changePassword'])
    router.delete('/', [() => import('#controllers/account_controller'), 'destroy'])
  })
  .prefix('/api/account')
  .use(middleware.auth())
