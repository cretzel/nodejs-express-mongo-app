var databaseUrl = "expressPostsDb";
var collections = ["posts"];
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.user = function(req, res) {
    res.send('Welcome to the profile of ' + req.params.user + '!');
};

exports.getPosts = function(req, res) {
    
    db.posts.find({}, function(err, posts) {
	if (err) {
	    console.log("No Posts found " + err);
	    res.writeHead(500);
	} else {
	    console.log(JSON.stringify(posts));
	    res.format({
		html: function() {res.render('posts', {posts: posts, title:"Express"});},
		json: function() {res.send(posts)}
	    });
	}
    });

};

exports.getPost = function(req, res) {

    db.posts.find({_id: ObjectId(req.params.id)}, function(err, posts) {
	if (err || !posts) {
	    res.writeHead(404);
	} else {
	    console.log(JSON.stringify(posts[0]));
	    res.render('post', {post:posts[0], title:"Express"});
	}
    });

};

exports.postPost = function(req, res) {
    var title = req.body.title;
    var content = req.body.content;

    db.posts.save({title:title, content:content}, function(err, saved) {
	if( err || !saved ) {
	    console.log("Post not saved " + err);
	    res.writeHead(500);
	} else {
	    res.redirect("/posts");
	}
    });


}