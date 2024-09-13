module.exports.isSignedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        req.session.messages = 'You need to sign in to view that page.'
        res.redirect('/users/log-in');
    }
}