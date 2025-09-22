
import morgan from 'morgan';
import requestLogger from '../utils/requestLogger';


const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => requestLogger.http(message.trim()),
        },
    },
);

export default morganMiddleware;