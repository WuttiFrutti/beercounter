const niv = require('node-input-validator');
niv.extendMessages({
  required: '* Vereist',
  email: 'E-mail adres moet valide zijn',
  status: 'Invalide status',
  minLength: "Een :attribute moet een minimale lengte hebben van :arg0."
}, 'en');


niv.niceNames({
  username: 'Gebruikersnaam',
  email: 'Email',
  password: "Wachtwoord"
});

const mapper = (e) => {
  Object.entries(e).forEach(([key, value]) => {
    e[key] = value.message;
  });
  return e;
};


module.exports = niv;
module.exports.mapper = mapper;