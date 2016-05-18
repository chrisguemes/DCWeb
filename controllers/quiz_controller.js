//var models = require('../models/models.js');
//
//// Autoload - factoriza si se incluye quizId en la ruta
//exports.load = function(req, res, next, quizId) {
//	models.Quiz.findById(quizId).then (
//		function(quiz) {
//			if(quiz) {
//				req.quiz = quiz;
//				next();
//			} else {
//				next(new Error('No existe quizId=' + quizId));
//			}
//		}
//	).catch(function(error) { next(error);});
//};
//
////GET /quizes
//exports.index = function(req, res) {
//	if(req.query.search) {
//		models.Quiz.findAll({
//			where: ["pregunta like ?", "%" + req.query.search + "%"]
//		}).then (
//			function(quizes) {
//				res.render('quizes/index.ejs', {quizes: quizes});
//			}
//		)
//	} else {
//		models.Quiz.findAll().then(
//			function(quizes) {
//				res.render('quizes/index.ejs', {quizes: quizes});
//			}
//		)
//	}
//	
//	
//}
//
////GET /quizes/:quizId(\\d+)
//exports.show = function(req, res) {
//	res.render('quizes/show', {quiz: req.quiz});
//};
//
////GET /quizes/:quizId(\\d+)/answer
//exports.answer = function(req, res) {
//	var resultado = 'Incorrecto';
//	if(req.query.respuesta === req.quiz.respuesta) {
//		console.log("resultado OK");
//		resultado = 'Correcto';
//	} else {
//		console.log("resultado NOK, respuesta correcta:" + req.quiz.respuesta);
//	}
//	
//	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
//};
//