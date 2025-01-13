# 🏓 Ft_transcendence

Make a fullstack website to play Pong (Youpi...)

=> Project made in collaboration with [@Doboy9](https://github.com/Doboy9) and [@Argaus1](https://github.com/Argaus1)

- Here is the subject : [Subject](https://cdn.intra.42.fr/pdf/pdf/133398/en.subject.pdf)

```bash
make ## to launch the project (https://localhost)
```

## STACK (JBDS)

> JBDS stack is popular right ??

- FRONTEND : Vanilla JS [Documentation](https://www.w3schools.com/js/DEFAULT.asp)
- CSS library : Bootstrap toolkit [Documentation](https://getbootstrap.com/)
- BACKEND : Django (Python) [Documentation](https://docs.djangoproject.com/en/5.1/)
- DB : PostgreSQL [Documentation](https://www.postgresql.org/docs/current/) [Container](https://hub.docker.com/_/postgres/)

For our project, we implemented the `MicroServices` module, which indicates that each service has its own database and its own Django instance.


## 🗃️ OBLIGATIONS

- SPA (single-page-application)
- Compatible with ***Google Chrome***
- Everything must be launched with a single command line (Docker, like in *Inception*)
- Responsive ??

## 🕹️ GAME

The primary objective of this website is to facilitate Pong gameplay between users. Here are the key features:

- **Live Pong Gameplay**: Users should be able to engage in a live Pong game against another player directly on the website. Both players will use the same keyboard. The functionality can be enhanced with the Remote players module.

- **Tournament Mode**: Besides one-on-one games, users should also have the option to propose a tournament. This tournament will involve multiple players taking turns to play against each other. The implementation of the tournament is flexible, but it should clearly display the match-ups and the player order.

- **Registration System**: A registration system is necessary. At the start of a tournament, each player must input their alias. These aliases will be reset when a new tournament begins. The Standard User Management module can modify this requirement.

- **Matchmaking System**: The tournament system should organize the matchmaking of the participants and announce the upcoming match.

- **Uniform Game Rules**: All players must follow the same rules, including having identical paddle speed. This rule also applies to AI players; the AI must operate at the same speed as a human player.

- **Game Development**: The game must be developed in accordance with the default frontend constraints (as outlined above). Alternatively, the FrontEnd module can be used, or it can be overridden with the Graphics module. Regardless of the visual aesthetics, the game must retain the essence of the original Pong (1972).

## 🔐 SECURITY

1. **Password Hashing**: If your database stores passwords, ensure they are hashed.
2. **Protection Against Attacks**: Your website should be safeguarded against SQL injections and XSS.
3. **HTTPS Connection**: If your site features a backend or other elements, activating an HTTPS connection for all components is compulsory. Use wss instead of ws.
4. **Input Validation**: Implement a validation system for forms and user input. This can be done on the base page if there's no backend, or server-side if a backend is present.
5. **Website Security**: Prioritizing your website's security is crucial, whether or not you choose to implement the JWT Security module with 2FA. For example, if you decide to develop an API, make sure your routes are secure. Even if you choose not to use JWT tokens, the security of your site remains paramount.

## 🔍 Modules (35 / 25)

To achieve 100% completion, you need to complete 7 major modules.

**Note** : Please note that two minor modules are equivalent to one major module.

### Bonus Points

- Each minor module completed will earn you an additional five points.
- Each major module completed will earn you an additional ten points.

### List of all the modules that we did

```Major module:```

- [x] Use a framework as backend (Django)
- [x] Store the score of a tournament in the Blockchain.
- [x] Standard user management, authentication, users across tournaments
- [x] Implementing a remote authentication.
- [x] Add Another Game with User History and Matchmaking
- [x] Introduce an AI Opponent.
- [x] Implement WAF/ModSecurity with Hardened Configuration and HashiCorp Vault for Secrets Management
- [x] Designing the Backend as Microservices

```Minor module:```
- [x] GDPR Compliance Options with User Anonymization, Local Data Management, and Account Deletion
- [x] Expanding Browser Compatibility
- [x] Game Customization Options.
- [x] Use a database for the backend -and more.
- [x] Use a front-end framework or toolkit
