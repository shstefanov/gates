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
      assert.throws(()=>{ gate._send(invalid_target); },  Error );
    });

  });

  it("Target can't be empty error", () => {
    const gate = new Gate("gate_1");
    assert.throws(()=>{ gate._send([]); },  Error );
  });

  it("Sends invalid target", () => {
    const gate = new Gate("gate_1");
    assert.throws(()=>{ gate._send(["invalid_id"]); },  Error );
  });

  it("Handle message", () => {
    let param, callback;
    class ChildGate extends Gate {
      handle(data, cb){
        param = data, callback = cb;
      }
    }

    const gate = new ChildGate("gate_1");
    gate._send(["gate_1"], 55);

    assert.equal(param, 55);
    assert.equal(callback, undefined);

  });

  it("Sends message trough chain (2 nodes)", () => {

    let param, callback;
    class ChildGate extends Gate {
      handle(data, cb){
        param = data, callback = cb;
      }
    }

    const root   = new Gate("root");
    const branch = new ChildGate("branch");
    root.add(branch);

    root.send(["branch"], { data: 22 });
    assert.deepEqual(param, { data: 22 });
    assert.equal(callback, undefined);
  });

  it("Sends message trough chain (4 nodes)", () => {
    let param, callback;
    class ChildGate extends Gate {
      handle(data, cb){
        param = data, callback = cb;
      }
    }

    const root   = new Gate("root");
    const a1     = new Gate("a1");
    const a2     = new Gate("a2");
    const branch = new ChildGate("branch");
    root.add(a1);
    a1.add(a2);
    a2.add(branch);

    root.send(["a1", "a2", "branch"], { data: 33 });
    assert.deepEqual(param, { data: 33 });
    assert.equal(callback, undefined);
  });

  it("Callbacks (2 nodes)", (next) => {
    let param, callback;
    class ChildGate extends Gate {
      handle(data, cb){
        param = data, callback = cb;
        cb(12, "34", [123])
      }
    }

    const root   = new Gate("root");
    const a1     = new ChildGate("a1");
    root.add(a1);

    root.send(["a1"], { data: 45 }, function(...args){
      assert.deepEqual(param, { data: 45 });
      assert.deepEqual(args, [12, "34", [123]]);
      root.send(["a1"], { data: 46 }, function(...args){
        assert.deepEqual(param, { data: 46 });
        assert.deepEqual(args, [12, "34", [123]]);
        next();
      });
    });

  });

});