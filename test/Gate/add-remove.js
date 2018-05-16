var assert = require("assert");

describe(`Class Gate.add, Gate.remove
  (${__filename})`, () => {

  const Gate   = require("../../lib/Gate");

  it("Gate.add (invalid parameters)", () => {
    const gate    = new Gate("root");
    [
      undefined,
      null,
      123,
      [],
      {},
      function(){},
      /aaa/,
      true,
      false
    ].forEach((invalid_gate)=>{
      assert.throws(()=>{ gate.add(invalid_gate); },  Error);
    });
  });

  it("Gate.add", () => {
    const gate    = new Gate("root");
    const gate2   = new Gate("gate2");
    
    gate.add(gate2);
    
    assert.equal(gate.gates.size, 1);
    assert.ok(gate.gates.has("gate2"));

    assert.equal(gate2.gates.size, 1);
    assert.ok(gate2.gates.has("root"));
  });

  it("Gate.remove (invalid parameters)", () => {
    const gate    = new Gate("root");
    [
      undefined,
      null,
      123,
      [],
      {},
      function(){},
      /aaa/,
      true,
      false
    ].forEach((invalid_gate)=>{
      assert.throws(()=>{ gate.remove(invalid_gate); },  Error);
    });
  });

  it("Gate.remove", () => {
    const gate    = new Gate("root");
    const gate2   = new Gate("gate2");
    
    gate.add(gate2);
    gate.remove(gate2);
    
    assert.equal(gate.gates.size, 0);
    assert.ok(!gate.gates.has("gate2"));

    assert.equal(gate2.gates.size, 0);
    assert.ok(!gate2.gates.has("root"));
  });

  it("Adds gate child class instance", () => {
    class Child extends Gate {}
    const gate    = new Gate("root");
    const gate2   = new Child("gate2");
    gate.add(gate2);
    assert.equal(gate.gates.size, 1);
    assert.ok(gate.gates.has("gate2"));
  });




});