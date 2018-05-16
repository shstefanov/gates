const assert = require("assert");

describe(`Class Gate.send 
  (${__filename})`, () => {

  const Gate = require("../../lib/Gate");

  it("Gate accepts only arrays as target for sending message", () => {
    const gate = new Gate("gate_1");
    [
      undefined,
      null,
      123,
      "",
      "1234",
      {},
      function(){},
      /aaa/,
      true,
      false
    ].forEach((invalid_target)=>{
      assert.throws(()=>{ gate.send(invalid_target); },  Error );
    });

  });

  it("Target can't be empty error", () => {
    const gate = new Gate("gate_1");
    assert.throws(()=>{ gate.send([]); },  Error );
  });

  it("Sends invalid target", () => {
    const gate = new Gate("gate_1");
    assert.throws(()=>{ gate.send(["invalid_id"]); },  Error );
  });

  it("Handle message", () => {
    let param, callback;
    class ChildGate extends Gate {
      handle(data, cb){
        param = data, callback = cb;
      }
    }

    const gate = new ChildGate("gate_1");
    gate.send(["gate_1"], 55);

    assert.equal(param, 55);
    assert.equal(callback, undefined);

  });

  it("Sends message trough chain", ()=>{
    let param, callback;
    class ChildGate extends Gate {
      handle(data, cb){
        param = data, callback = cb;
      }
    }

    const root   = new Gate("root");
    const branch = new ChildGate("branch");
    root.add(branch);

    root.send(["root", "branch"], { data: 22 });
    assert.deepEqual(param, { data: 22 });
  });

});