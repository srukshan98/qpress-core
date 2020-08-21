import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { QExpress } from './express';
import { AppConfig } from './consts/app-config';

export function qpress(config: AppConfig = { JsonParser: true }): QExpress {
    const app: Express = express();

    setParser(config, app);

    return new QExpress(app);
}

function setParser(config: AppConfig, app: express.Express): void {
    if (config.JsonParser) {
        app.use(bodyParser.json(config.ParserConfig));
        app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );
    }
}
