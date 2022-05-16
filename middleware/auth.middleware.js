module.exports = {
    isLoggedin: (req, res, next) => {
        if(!req.session.user) {
            res.redirect("/login")
        } else {
            next();
        }
    },
    // isCreator: (req, res, next) => {
    //     if(req.session.user._id === creador) {
    //         next();
    //     } else {
    //         return;
    //     }
    // }
}
