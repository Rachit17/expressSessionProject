


app.get('/', function(req, res){

	fs.readFile('./index.html', 'utf-8', function(err, data){
		if(err) throw err;

		res.send(data);
	})
});

app.post('/loginForm', function(req, res){
	console.log(req.body);

	res.render('registration.html', req.body);
});
