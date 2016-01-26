var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

function UserHandler(){
    //API Param Functions
    this.getByName = getUserByName;
    
    //API Functions
    this.register = register;
    this.logIn = login;
    this.getUser = getUser;
    this.getUserBars = getUserBars;
    this.addBar= addBar;
    this.removeBar = removeBar;
    this.getLocation = getLocation;
    this.setLocation = setLocation;
    this.setProfileInfo = setProfileInfo;
    
    //Controller Functions
    this.getBarGoers = getBarGoers;
    
    
    function getUserByName(req, res, next, username) {
        var query = User.findOne({username: username}, {hash: 0, salt: 0});
        
        query.exec(function(err,user){
          if(err){return next(err);}
          if(!user){return next(new Error('can\'t find user'));}
          
          req.user = user;
          return next();
        });
    }
    
    
    function register(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
    
      var user = new User();
      user.username = req.body.username;
      user.setPassword(req.body.password);
    
      user.save(function(err){
        if(err){return next(err);}
    
        return res.json({token: user.generateJWT()});
      });
    
    }
    
    function login(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
    
      passport.authenticate('local', function(err, user, info){
        if(err){return next(err);}
    
        if(user){
          return res.json({token: user.generateJWT()});
        } else {
          return res.status(401).json(info);
        }
      })(req,res,next);
    }
    
    function getUser(req, res, next){
      res.json(req.user);
    }
    
    function getUserBars(req, res, next){
        res.json(req.user.bars);
    }
    
    function addBar(req, res, next){
      if(req.user.bars.indexOf(req.params.bar) !== -1){
        return next(new Error('Can\'t add two bars with same id'));
      }
      
      req.user.bars.push(req.params.bar);
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(user.bars);
      });
    }
    
    function removeBar(req, res, next){
      var barIndex = req.user.bars.indexOf(req.params.bar);
      if(barIndex === -1){return next(new Error('User does not have that bar.'));}
      
      req.user.bars.splice(barIndex,1);
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(user.bars);
      });
    }
    
    function getLocation(req,res,next){
      res.json(req.user.location);
    }
    
    function setLocation(req, res, next){
      req.user.location = req.params.location;
      
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(user.location);
      });
    }
    
    function setProfileInfo(req, res, next){
      if(req.payload.username !== req.user.username){return next(new Error('Cannot change profiles other than yours.'));}
      
      req.user.name = req.body.name;
      req.user.image_url = req.body.image_url;
      req.user.motto = req.body.motto;
      req.user.location = req.body.location;
      
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(req.user);
      });
      
    }
    
    
    function getBarGoers(cb){
      User.find({bars: {$gt: 0}}, 'username bars', function(err, users){
        if(err){return err;}
        
        cb(users);
      });
    }
    
}

module.exports = UserHandler;