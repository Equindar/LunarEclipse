import configuration from '../config';
import { auth } from 'express-oauth2-jwt-bearer';
import logger from '../utils/apiLogger';

const authUserWithAuth0 = () => {
    auth({
        audience: configuration.auth.audience,
        issuerBaseURL: configuration.auth.issuerBaseURL,
    })
    logger.debug("in authenticateUser");
};

export default authUserWithAuth0;