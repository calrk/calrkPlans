var loggedIn = false;
var user;

function login(){
	email = document.getElementById("email").value;
	document.getElementById("loginError").className = "errorDiv closed";

	if(email.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/) == null){
		document.getElementById("loginError").innerHTML = "Invalid Email.";
		document.getElementById("loginError").className = "errorDiv";
		return false;
	}

	var password = document.getElementById("password").value;
	if(!password){
		document.getElementById("loginError").innerHTML = "No password.";
		document.getElementById("loginError").className = "errorDiv";
		return false;
	}
	password = md5(password+email);
	document.getElementById("password").value = "";

	socket.emit('login', {email:email, password:password});
	return false;
}

function loginEnd(args){
	if(args.success){
		user = args.id;
		document.getElementById("mapDiv").style.display = "block";
		document.getElementById("loginDiv").style.display = "none";
		initialiseMaps();
	}
	else{
		console.log("Log in failed: " + args.reason);
		document.getElementById("loginError").innerHTML = args.reason;
		document.getElementById("loginError").className = "errorDiv";
	}
}

function createAccount(){
	document.getElementById("createAccountError").className = "errorDiv closed";
	document.getElementById("createAccountSuccess").className = "successDiv closed";

	var email = document.getElementById("newEmail").value;
	if(email.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/) == null){
		document.getElementById("createAccountError").innerHTML = "Invalid Email.";
		document.getElementById("createAccountError").className = "errorDiv";
		return false;
	}
	var password = document.getElementById("newPassword").value;
	if(!password){
		document.getElementById("createAccountError").innerHTML = "No password.";
		document.getElementById("createAccountError").className = "errorDiv";
		return false;
	}
	password = md5(password+email);
	document.getElementById("password").value = "";

	socket.emit('createAccount', {email:email, password:password});
	return false;
}

function accountEnd(args){
	console.log(args)
	if(args.success){
		document.getElementById("createAccountSuccess").innerHTML = "Account created.";
		document.getElementById("createAccountSuccess").className = "successDiv";
		document.getElementById("createAccountError").className = "errorDiv closed";
	}
	else{
		document.getElementById("createAccountError").innerHTML = args.reason;
		document.getElementById("createAccountError").className = "errorDiv";
	}
}

function switchLogDiv(id){
	document.getElementById("login").className = "loginmenu closed";
	document.getElementById("createAccount").className = "loginmenu closed";

	document.getElementById(id).className = "loginmenu";
}

function updateEmail(obj){
	document.getElementById("email").value = obj.value;
	document.getElementById("newEmail").value = obj.value;
}