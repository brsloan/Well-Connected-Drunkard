var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

function UserHandler(){
    
    this.register = function(req, res, next){
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
    
    this.logIn = function(req,res,next){
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
    
    this.getByName = function(req, res, next, username) {
        var query = User.findOne({username: username});
        
        query.exec(function(err,user){
          if(err){return next(err);}
          if(!user){return next(new Error('can\'t find user'));}
          
          req.user = user;
          return next();
        });
    }
    
    this.getUserBars = function(req, res, next){
        res.json(req.user.bars);
    };
    
    this.addBar= function(req,res,next){
      if(req.user.bars.indexOf(req.params.bar) !== -1){
        return next(new Error('Can\'t add two bars with same id'));
      }
      
      req.user.bars.push(req.params.bar);
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(user.bars);
      });
    }
    
    this.removeBar = function(req, res, next){
      var barIndex = req.user.bars.indexOf(req.params.bar);
      if(barIndex === -1){return next(new Error('User does not have that bar.'));}
      
      req.user.bars.splice(barIndex,1);
      req.user.save(function(err,user){
        if(err){return next(err);}
        
        res.json(user.bars);
      });
    }
    
    this.getLocation = function(req,res,next){
      res.json(req.user.location);
    }
    
    this.setLocation = function(req, res, next){
      req.user.location = req.params.location;
      
      req.user.save(function(err,user){
        if(err){return next(err)};
        
        res.json(user.location);
      })
    }
    
    this.getBarGoers = function(req,res,next){
      User.find({bars: {$gt: 0}}, 'username bars', function(err, users){
        if(err){return next(err);}
        
        res.json(users);
      })
    }
    
    this.getBarGoersServer = function(cb){
      User.find({bars: {$gt: 0}}, 'username bars', function(err, users){
        if(err){return err;}
        
        cb(users);
      })
    }
    
}

module.exports = UserHandler;