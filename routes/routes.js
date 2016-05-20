var express = require('express');
var fs = require('fs');
//var quizController = require('../controllers/quiz_controller');
var router = express.Router();

// GET home page
router.get('/', function(req, res) {
	res.render('index', { title: 'PRIME topology' });
});

router.get('/updT', function(req, res) {
	// Escribir una línea de comando en un fichero de texto
	fs.writeFile('public/message.txt', '0', function (err) {
        if (err) throw err;
        //console.log('It\'s saved! in same location.');
    });
	// Renderizar la misma vista de index
	res.render('index', { title: 'PRIME topology' });
});

router.get('/updV', function(req, res) {
	// Escribir una línea de comando en un fichero de texto
	fs.writeFile('public/message.txt', '1', function (err) {
        if (err) throw err;
        //console.log('It\'s saved! in same location.');
    });
	// Renderizar la misma vista de index
	res.render('index', { title: 'PRIME topology' });
});

//// Autoload de comandos con quizId
//router.param('quizId', quizController.load);
//
//router.get('/quizes', quizController.index);
//router.get('/quizes/:quizId(\\d+)', quizController.show);
//router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

module.exports = router;
