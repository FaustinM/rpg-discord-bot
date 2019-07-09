module.exports = {
  admin : [
      {
          name: "!debug",
          description : "Toutes les commandes pour vérifier l'état du bot",
          subcommands : [
              {
                  name: "!debug msg <identifiant>",
                  description : "Permet de tester les différents messages du bot",
              },
              {
                  name: "!debug info",
                  description : "Permet d'obtenir les différentes informations du bot",
              },
              {
                  name: "!debug ping",
                  description : "Permet de vérifier que le bot est en ligne ainsi que d'avoir son ping"
              },
              {
                  name: "!debug restart",
                  description : "Permet de redémarrer le bot (seul Faustin peut le faire)"
              },
          ],
      },
      {
          name: "!money",
          description : "Toutes les commandes pour interagir avec l'économie",
          subcommands : [
              {
                  name: "!money bal <utilisateur>",
                  description : "Permet de connaître l'argent d'un joueur",
              },
              {
                  name: "!money reset <utilisateur>",
                  description : "Permet de remettre à solde de départ un compte et donc de pouvoir l'utilisé",
              },
              {
                  name: "!money add <utilisateur> <montant>",
                  description : "Permet d'ajouter de l'argent à un utilisateur"
              },
              {
                  name: "!money remove <utilisateur> <montant>",
                  description : "Permet de retirer de l'argent à un utilisateur"
              },
          ],
      },
      {
          name: "!channel",
          description : "Toutes les commandes pour gérer les channels",
          subcommands : [
              {
                  name: "!channel alias add <channel> <alias>",
                  description : "Permet d'ajouter des alias",
              },
              {
                  name: "!channel alias remove <alias>",
                  description : "Permet de supprimer des alias",
              },
              {
                  name: "!channel alias list <channel>",
                  description : "Permet de lister les alias d'un channel",
              },
              {
                  name: "!channel role <role> <channel>",
                  description : "Permet de définir quel rôle à accès au salon (obligatoire pour permettre l'accès au salon)",
              },
          ],
      },
      {
          name: "!move <utilisateur> <channel>",
          description : "Déplacer un utilisateur à un autre channel (à utiliser en dernier recours, utilisez plutôt les permissions)",
      },
      {
          name: "!help <commande>",
          description : "Permet d'en savoir plus à propos d'une commande",
      },
      {
          name: "!fiche",
          description : "Pour pouvoir gérer les fiches",
          subcommands : [
              {
                  name: "!fiche create <utilisateur>",
                  description : "Permet de crée une nouvelle pour le joueur",
              },
              {
                  name: "!fiche modify <utilisateur> <élément> <donnée>",
                  description : "Permet de modifier une fiche. Attention les seuls éléments modifiables sont metier, name, role, faction",
              },
              {
                  name: "!fiche info <identifiant de fiche>",
                  description : "Permet d'obtenir les informations d'une fiche avec son identifiant (obtenable avec la commande list)",
              },
              {
                  name: "!fiche list <utilisateur>",
                  description : "Permet de lister les fiches d'un joueur",
              },
              {
                  name: "!fiche mort <utilisateur>",
                  description : "Considère la fiche active du joueur comme mort",
              },
          ]
      },
      {
          name: "!metier",
          description : "Pour pouvoir gérer les métiers",
          subcommands : [
              {
                  name: "!metier create <nom> <gain> <temps en ms>",
                  description : "Crée un nouveau métier. Le temps est en milliseconde",
              },
              {
                  name: "!metier modify <nom> <élément> <donnée>",
                  description : "Permet de modifier un métier. Les éléments modifiables sont : time, earn. Time est en ms",
              },
              {
                  name: "!metier info <nom>",
                  description : "Permet d'obtenir les informations d'un métier",
              },
              {
                  name: "!metier list",
                  description : "Permet de lister tous les métiers",
              },
              {
                  name: "!metier delete <nom>",
                  description : "Permet de supprimer un métier (attention aux fiches qui ont toujours le métier)",
              },
          ]
      },
  ],
  rp : [
      {
          name: "Déplacement de channel en channel",
          description : "Utilisable avec `*va à <channel/alias>*`",
      },
      {
          name: "Ouvrir son portefeuille",
          description : "Utilisable avec différente commande (voir faustin pour la liste complète)",
      },
  ]
};