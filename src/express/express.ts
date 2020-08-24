import { print } from './../providers/log.provider';
import { Express } from 'express';
import { DecoratorHandler } from '../handlers/decorator.handler';
import { DecoratorType } from '../decorators/types/decorator.type';
import { NullModuleDecoratorException } from '../exceptions/decorators/null-module-decorator.exception';
import { Server } from 'http';
import { Socket } from 'dgram';
export class QExpress {
	server: Server | null = null;
	constructor(public express: Express) {}

	attachModule(module: Function): void {
		const decoratorHandler: DecoratorHandler = DecoratorHandler.fromModule(
			module
		);

		if (decoratorHandler.getType() !== DecoratorType.Module) {
			throw new NullModuleDecoratorException();
		}

		decoratorHandler.attachRouter(this.express);

		decoratorHandler.processDecorators();
		print.info(module.name, 'was successfully attached');
	}

	runApp(port = process.env.PORT || 3000): void {
		this.server = this.express.listen(port, () => {
			print.info(`Quick Express Server is running in http://localhost:${port}`);
		});
		// this.server.on("listening", print.log)
		this.server.on('connection', (socket: Socket) =>
			print.info(socket.address())
		);
		// this.server.on("error", print.log)
		// this.server.on("close", print.log)
		// const readline = require('readline');

		// readline.emitKeypressEvents(process.stdin);
		// process.stdin.setRawMode(true);

		// process.stdin.on('keypress', (_, data) => {
		//   if (data.ctrl && data.name === 'q') {
		//     this.server?.removeAllListeners().close()
		//     process.exit();
		//   }
		// });
		// print.log('Press `a` to quit')
	}
}
