import bcrypt from 'bcryptjs';
const password = "$2a$10$"; 
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log("Your Admin Password Hash:");
        console.log(hash);
    });
});