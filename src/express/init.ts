import { print } from './../providers/log.provider';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { QExpress } from './express';
import { AppConfig } from './consts/app-config';
import { LogLevelType } from './types/log-level.type';

export function qpress(config: AppConfig = { JsonParser: true }): QExpress {
  print.clear();
  const app: Express = express();

  setParser(config, app);
  setConfigurations(config);

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

function setConfigurations(config: AppConfig): void {
  config.LogLevel = config.LogLevel ?? LogLevelType.Verbose;

  switch (config.LogLevel) {
    case LogLevelType.None:
      print.info = (..._) => { };
      print.time = (..._) => { };
      print.timeEnd = (..._) => { };
    case LogLevelType.Minimal:
      print.debug = (..._) => { };
      print.log = (..._) => { };
      break;
  }
}
