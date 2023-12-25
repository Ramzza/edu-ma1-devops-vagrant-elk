const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const logger = require('../logger/logger');

router.post('/register', async (req, res) => {
	logger.info('User AUTH-register called', 'crud~auth~register');
	console.log('BE: arriverd to /register');
	console.log('BE: body - ' + JSON.stringify(req.body));

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		cnp: req.body.cnp,
		email: req.body.email,
		username: req.body.username,
		password: hashPassword,
	});

	console.log('BE: user - ' + user);
	try {
		const savedUser = await user.save();
		logger.info('User AUTH-register successful', 'crud~auth~register');
		console.log('BE: resOK - ' + savedUser);
		res.json(savedUser);
	} catch (err) {
		logger.error('User AUTH-register failed', 'crud~auth~register');
		console.log('BE: resErr - ' + err);
		res.json({ message: err });
	}
});

router.post('/login', async (req, res) => {
	logger.info('User AUTH-login called', 'crud~auth~login');
	let oUser = await User.findOne({ username: req.body.username });
	if (!oUser) {
		logger.error('User AUTH-login failed', 'crud~auth~login');
		return res
			.status(400)
			.send(JSON.stringify({ message: 'Wrong credentials' }));
	}

	console.log(oUser);

	const validPass = await bcrypt.compare(req.body.password, oUser.password);
	if (!validPass) {
		logger.error('User AUTH-login failed', 'crud~auth~login');
		return res
			.status(400)
			.send(JSON.stringify({ message: 'Wrong credentials' }));
	}
	logger.info('User AUTH-login successful', 'crud~auth~login');

	oUser.password = null;
	res.send(JSON.stringify(oUser));
});

module.exports = router;
