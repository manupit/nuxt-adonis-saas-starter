/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    forgotPassword: typeof routes['auth.forgot_password']
    resetPassword: typeof routes['auth.reset_password']
    logout: typeof routes['auth.logout']
    me: typeof routes['auth.me']
  }
  account: {
    update: typeof routes['account.update']
    changePassword: typeof routes['account.change_password']
    destroy: typeof routes['account.destroy']
  }
}
