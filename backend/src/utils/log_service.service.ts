import { ConsoleLogger } from "@nestjs/common";
import {
    createLogger,
    format,
    transports,
    Logger as WinstonLogger
} from 'winston'
import { join} from "path";




export class LoggerService extends ConsoleLogger{
    private readonly logger: WinstonLogger
    constructor() {
        super()

        

        const logDir = join(process.cwd(),"logs")      
        const logFormat = format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message,context,stack}) => {
                return `${timestamp} [${context||'Application'}] ${level} : ${message} ${stack|| ""}`
            })
        )
        this.logger = createLogger({
            level: "info",
            format: logFormat,
            transports: [new transports.Console(),
                new transports.File({ filename: join(logDir, 'error.log'), level: 'error' }),
                new transports.File({ filename: join(logDir, 'info.log'), level: 'info' }),
                new transports.File({ filename: join(logDir,'debug.log'),level:'debug'})
                
            ]
        })
    }

    error(message:any,trace?:string,context?:string):void {
        this.logger.error({ message, context, stack: trace })
        super.error(
            `CODE:ERROR_CODE , Message:${message}, Trace:${trace}`,
            trace,
            context
        )
    }

    log(message: any,context?: string): void {
        this.logger.info({ message, context })
        super.log(
            `CODE:LOG_CODE , Message:${message}`,
            context
        )
    }

    debug(message: any,context?: string): void {
        this.logger.debug({ message, context })
        super.debug(
            `CODE:LOG_CODE , Message:${message}`,
            context
        )
    }


}