module.exports = (req, res, next) =>{
    if(!req.email){
        res.redirect('/account/login');
    } else next();
}