var express = require('express');
var app = express();
var expressSanitizer = require('express-sanitizer')
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'));

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date , default:Date.now}
});
var Blog = mongoose.model('Blog',blogSchema);

//Routes 
app.get('/',function(req,res){
	res.redirect('/blogs');
});
app.get('/blogs',function(req,res){
		Blog.find({},function(err,blogs){
		if(err){
			console.log('ERROR')
		}else{
			res.render('index',{blogs:blogs});
		}
	})
})
//New ROute

app.get('/blogs/new',function(req,res){
	res.render('new')
})
//Create ROute
app.post('/blogs',function(req,res){
	//create blog
	req.body.blog.body  = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render('new')
		}else{
			//redirect to index 
			res.redirect('/blogs')
		}


	})
})
//show route
app.get('/blogs/:id',function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect('/blogs')
		}else{
			res.render('show',{blog:foundBlog});
		}
	})

})
//edit route
app.get('/blogs/:id/edit',function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect('/blogs')
		}else{
			res.render('edit',{blog:foundBlog})
		}
	})
})

//update Route
app.put('/blogs/:id',function(req,res){
		req.body.blog.body  = req.sanitize(req.body.blog.body)

	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect('/blogs')
		}else{
			res.redirect('/blogs/'+ req.params.id)
		}
	})
})
//delete Route
app.delete('/blogs/:id',function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect('/blogs')
		}else{
			res.redirect('/blogs')
		}
	})
})


app.listen(3000,function(){
	console.log('BLOG App is running ')
})