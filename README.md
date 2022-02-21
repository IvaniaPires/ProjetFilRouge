# ProjetFilRouge

le fichier .sample-env contient les variables d'environement que sont présentes sur un fichier .env.

obtention de random secret pour token:
ouvrir un nouveau terminal executer commande node et après
  require('crypto').randomBytes(64).toString('hex')
