

// Check if it is a password is long enough
exports.validatePassword = function(password) {
    if (password.length > 5){
        return true;
    }else{
        return false;
    }
    
}