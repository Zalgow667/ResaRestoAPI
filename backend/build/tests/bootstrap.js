import { assert } from '@japa/assert';
import { apiClient } from '@japa/api-client';
import app from '@adonisjs/core/services/app';
import { pluginAdonisJS } from '@japa/plugin-adonisjs';
import testUtils from '@adonisjs/core/services/test_utils';
import env from '#start/env';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
const execPromise = promisify(exec);
export const plugins = [
    assert(),
    apiClient({
        baseURL: `http://${env.get('HOST')}:${env.get('PORT')}`,
    }),
    pluginAdonisJS(app),
];
export const runnerHooks = {
    setup: [
        async () => {
            if (env.get('NODE_ENV') !== 'test') {
                console.error("Attention: Le fichier .env n'est pas en mode test et peut s'exécuter sur la mauvaise base de données.");
                throw new Error("Environnement incorrect pour l'exécution des tests. Veuillez passer en mode 'test'.");
            }
            else {
                console.log('Début des tests');
                await execPromise('node ace migration:refresh');
            }
        },
    ],
    teardown: [
        async () => {
            console.log('Fin des tests');
        },
    ],
};
export const configureSuite = (suite) => {
    if (['browser', 'functional', 'e2e'].includes(suite.name)) {
        return suite.setup(() => testUtils.httpServer().start());
    }
};
//# sourceMappingURL=bootstrap.js.map