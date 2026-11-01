import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(6).maxLength(32)

/**
 * Inscription
 */
export const registerValidator = vine.create({
  name: vine.string().minLength(2).maxLength(100),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({ as: 'passwordConfirmation' }),
})

/**
 * Connexion
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

/**
 * Mise à jour du profil
 */
export const updateProfileValidator = vine.create({
  name: vine.string().minLength(2).maxLength(100),
})

/**
 * Changement de mot de passe
 */
export const changePasswordValidator = vine.create({
  currentPassword: vine.string(),
  password: password().confirmed({ as: 'passwordConfirmation' }),
})

/**
 * Suppression de compte
 */
export const deleteAccountValidator = vine.create({
  password: vine.string(),
})

/**
 * Mot de passe oublié
 */
export const forgotPasswordValidator = vine.create({
  email: email(),
})

/**
 * Réinitialisation du mot de passe
 */
export const resetPasswordValidator = vine.create({
  token: vine.string(),
  password: password().confirmed({ as: 'passwordConfirmation' }),
})
