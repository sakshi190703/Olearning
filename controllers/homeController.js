class HomeController {
    // Render home page
    home = (req, res) => {
        res.render('home');
    };
}

module.exports = new HomeController();