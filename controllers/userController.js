import db from './../models';

const userController = {};



// Adding new users
userController.newUser = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    //Validating username
    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    //Validating password
    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    //Hashing password
	bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash
            });


    		user.save(function(err) {
        		if (err) {
            		return res.status(500).json({
                		message: 'Internal server error'
            		});
        		}

        		return res.status(201).json({
					username: username
				});
    		});
    	});
    });
}

// Login /login authenticate
userController.login = (req, res) => {
	res.status(200).send({message: "Login Success"});
};

//Find users
userController.findUser = (req, res) => {
    User.find({

    });
};

//Edit users
userController.editUser = (req, res) => {
    User.findOneAndUpdate({

    });
};

//Delete users
userController.deleteUser = (req, res) => {
    User.findOneAndRemove({

    });
};

export default userController