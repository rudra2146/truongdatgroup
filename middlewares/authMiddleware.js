const jwt = require('jsonwebtoken');

const authenticateAndAuthorize = (role) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'rudrarudra');
            req.user = decoded; 

            // Role authorization
            if (req.user.role !== role) {
                return res.status(403).json({ message: 'Access forbidden. Insufficient permissions.' });
            }

            next(); // Proceed to next middleware or route handler
        } catch (error) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
    };
};

module.exports = { authenticateAndAuthorize };
