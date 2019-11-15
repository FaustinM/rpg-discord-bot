

![Imgur](https://i.imgur.com/K7fTdeu.png)

# RPG - Discord Bot
Ce bot discord n'est au départ pas un bot public mais suite aux heures de travail et à la mort du projet j'ai décidé de mettre le repo en public ! Enjoy !
## Les différentes fonctionnalités

 - Un système d'argent
 - Un système de module
 - Un module de debug
 - Un module de fiche personnage
 - Une commande d'aide dynamique
 - Un système de gestion particulier aux channels
 - Un système de métier avec argent automatique
 - Une intégration avec sentry

## Le système de commande
Pour les joueurs du RP, une commande est une phrase commençant par * et finissant par *. Pour une même action plusieurs commandes peuvent être définie avec du regex. 

## Le système de module
Chaque commande est organisée comme un module, ce qui permet de l'activer et de la désactiver à la volée ! Il y a deux types de modules qui ont deux types d'activations différentes, les modules admins et joueurs

## Le système de traduction
Afin de faciliter la modification des messages, le fichier [message.js](https://github.com/FaustinM/rpg-discord-bot/blob/master/module/variable/message.js) permet de les gérer tous, il suffit de changer la ligne qui vous intéressent.

## Les dépendances

* [Discord.JS](https://discord.js.org/)
* [Ora](https://github.com/sindresorhus/ora)
* [Sentry](https://sentry.io/) n'est pas obligatoire !
* [mongoDB](https://mongodb.com)
