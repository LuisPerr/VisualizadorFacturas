 module.exports = {
 	static: require('./static'),
 	favicon: require('./favicon'),
 	locals: require('./locals'),
  bodyParserUrlencoded: require('./bodyParser').urlencoded,
  bodyParserJson: require('./bodyParser').json
  //morgan: require('./morgan')
 }
