import { OptionsJson } from 'body-parser';

export interface AppConfig {
    JsonParser: boolean;
    ParserConfig?: OptionsJson;
}
