module.exports = {
    isLoggedin: (req, res, next) => {
        if(!req.session.user) {
            res.redirect("/login")
        } else {
            next();
        }
    },
    isAdmin: (req, res, next) => {
        if(!req.session.user.admin) {
            res.redirect("/login")
        } else {
            next();
        }
    }
}
