
class Gate {


  // Base methods and properties

  constructor(id, options){
    if(typeof id !== "string") throw new Error("Gate id should be string");
    this.id         = id;

    this.options    = options;
    this.gates      = new Map();
  }

  add(gate, skip_set_back){

    if(!(gate instanceof Gate)) throw new Error(`Object ${ gate.id }, added to ${ this.id } is not a gate`);
    if(this.gates.has(gate.id)) throw new Error(`Gate ${ gate.id } already exists in ${ this.id }`);
    if(gate.gates.has(this.id)) throw new Error(`Gate ${ this.id } already exists in ${ gate.id }`);

    gate.gates.set(this.id, this);
    this.gates.set(gate.id, gate);
  }

  remove(gate){
    
    if(!(gate instanceof Gate))  throw new Error(`Object ${ gate.id }, removed from ${ this.id } is not a gate`);
    if(!this.gates.has(gate.id)) throw new Error(`Gate ${ this.id } does not contain gate ${ gate.id }`);
    if(!gate.gates.has(this.id)) throw new Error(`Gate ${ gate.id } does not contain gate ${ this.id }`);
    
    this.gates.delete(gate.id);
    gate.gates.delete(this.id);
  }

  _deserializeCallback(cb){
    if(typeof cb === "function") return cb;
    if(Array.isArray(cb)) return (...args) => { this.send(cb, [...args]) }
  }

  _serializeCallback(cb){
    // Serialize callback here
    return [this.id];

  }

  handleError(err){
    console.error(new Error(err));
  }

  handle(data, cb){
    this.handleError(`Gate '${ this.id }, instance of ${ this.constructor.name } should implement instance method handle(data, cb)`)
  }

  // Used to pass trough the gates
  _send(target, data, cb){

    if(!Array.isArray(target)) throw new Error(`Target should be array`);
    if(!target.length)         throw new Error(`Target can't be empty`);

    let target_id = target.shift();
    if(!target.length) { // Perform local handle
      if(target_id !== this.id) throw new Error(`Invalid target`);
      try {
        this.handle(data, this._deserializeCallback(cb));
      }
      catch(err){
        if(this.handleError){
          this.handleError(err, cb);
        }
        else throw err;
      }
      this.handle
    }

    else{
      let next = this.gates.get(target[0]);
      if(!next) throw new Error(`Invalid target ${target[0]}`);
      next._send(target, data, cb);
    }

  }

  send(target, data, cb){
    if(typeof data === "function"){
      cb = data, data = null;
    }

    if(typeof cb === "function"){
      cb = this._serializeCallback(cb);
    }
    this._send(target, data, cb);
  }

}

module.exports = Gate;