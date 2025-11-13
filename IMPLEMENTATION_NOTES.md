# Notes d'Implémentation - MyMonster

Dès le départ, j'ai priorisé la maintenabilité. Mon objectif était d'avoir une base de code solide qui permet d'ajouter des features facilement sans avoir à tout refactoriser.

Dans l'ensemble j'ai structuré le projet avec une séparation claire des responsabilités, par exemple avec les sérialiseurs pour convertir les documents mongo en objet anonyme pour envoyer au client.

J'ai utilisé les middleware mongoose pour encapsuler la logique des quêtes, en gros après le save du wallet par exemple on met à jour les quêtes `reach_coins` comme ça peu importe où j'ajoute des sous, ça met à jour les quêtes

Dans les fichiers de config, j'ai indexé les données dans des maps et des objets pour avoir un accès rapide et que l'IA arrête de faire des `.find()` dans toutes les actions.

**Gestion de l'IA et patterns**

Ce qui a été compliqué au final ça a été de driver l'IA efficacement. J'essayais de lui faire découper l'ensemble de ce qu'elle développait mais c'est pas encore ça. J'ai peut être mal prompté.

**Améliorations futures**

Les trois priorités : améliorer le design des monstres (plus de variété visuelle et des animations), ajouter des mini-jeux sur les actions, et implémenter le système d'accessoires que je n'ai pas eu le temps de faire.
