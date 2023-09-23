import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

/**
 * Interesting links:
 * https://google.github.io/styleguide/jsoncstyleguide.xml
 * https://learnku.com/docs/adonisjs/5.x/auth-api-tokens-guard/13111
 * https://adonismastery.com/blog/authentication-with-multiple-ids-in-adonisjs-5
 * https://stackoverflow.com/questions/39196968/laravel-5-3-new-authroutes
 * https://stackoverflow.com/questions/12806386/is-there-any-standard-for-json-api-response-format
 */
export default class LoginController {
  public async login({ auth, request, response }: HttpContextContract) {
    const authSchema = schema.create({
      email: schema.string.optional(),
      username: schema.string.optional(),
      password: schema.string([rules.minLength(6), rules.maxLength(180)]),
      rememberme: schema.boolean.optional(),
    })

    let email: string | undefined
    let username: string | undefined
    let password: string
    let rememberme: boolean | undefined

    try {
      const result = await request.validate({
        schema: authSchema,
      })

      email = result.email
      username = result.username
      password = result.password
      rememberme = result.rememberme
    } catch (error) {
      return response.badRequest({
        apiVersion: Env.get('LANGS_VERSION'),
        error: {
          code: 400,
          message: error.messages,
        },
      })
    }

    try {
      const userId = email || username || ''

      // last item is remember me token
      await auth.use('web').attempt(userId, password, !!rememberme)

      response.send({
        apiVersion: Env.get('LANGS_VERSION'),
        data: {
          user: auth.use('web').user!.toJSON(),
        },
      })
    } catch {
      response.unauthorized({
        apiVersion: Env.get('LANGS_VERSION'),
        error: {
          code: 401,
          message: 'Unable to authenticate',
        },
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()

    response.send({
      apiVersion: Env.get('LANGS_VERSION'),
      data: null,
    })
  }

  /*public async passwordEmail(ctx: HttpContextContract) {

  }

  public async passwordReset(ctx: HttpContextContract) {

  }

  public async passwordConfirm(ctx: HttpContextContract) {

  }

  public async register(ctx: HttpContextContract) {

  }*/
}
