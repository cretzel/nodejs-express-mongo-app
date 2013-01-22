var databaseUrl = "whatsapp";
var collections = ["messages"];
var mongojs = require("mongojs");
var db = mongojs.connect(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

exports.index = function(req, res){
  res.render('index', { title: 'Whatsapp' });
};

exports.postMessage = function(req, res) {
    var from = req.body.from;
    var to = req.body.to;
    var text = req.body.text;
    
    var message = {};
    message.from = from;
    message.to = to;
    message.text = text;
    message.status = "unread";
    message.date = new Date();

    db.messages.save(message, function(err, saved) {
	if( err || !saved ) {
	    console.log("Message not saved " + err);
	    res.writeHead(500);
	    res.end();
	} else {
	    res.redirect("/messages/to/" + to);
	}
    });


}

exports.getMessagesTo = function(req, res) {
    var to = req.params.user;
    var status = req.query.status;

    var query = {};
    query.to = to;
    if (status) query.status = status;
    
    db.messages.find(query).sort({date:1}, function(err, messages) {
	if (err) {
	    console.log("Error getting messages to " + to + " " + err);
	    res.writeHead(500);
	    res.end();
	} else {
	    //console.log(JSON.stringify(messages));
	    res.send(messages)
	}
    });

};

exports.markAsRead = function(req, res) {
    var id = req.params.id;
    
    db.messages.update({_id: ObjectId(id)}, {$set: {status:"read"}}, function(err) {
	if (err) {
	    console.log("Could not mark as read " + id);
	    res.writeHead(500);
	    res.end();
	} else {
	    res.writeHead(200);
	    res.end();
	}
    });

};
/*
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
*/