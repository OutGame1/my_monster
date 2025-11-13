import env from './env'

export default async function cronRoute (req: Request, handleCronJob: () => Promise<void>): Promise<Response> {
  // Vérification du secret d'autorisation
  if (req.headers.get('Authorization') !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Traitement asynchrone en arrière-plan
  void handleCronJob()
  return Response.json({ success: true })
}
