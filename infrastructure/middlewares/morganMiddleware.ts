import requestLogger from 'infrastructure/utilities/requestLogger';
import morgan from 'morgan';


const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => requestLogger.http(message.trim()),
        },
    },
);

export default morganMiddleware;