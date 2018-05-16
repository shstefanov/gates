const assert = require("assert");

describe(`Class Gate.constructor 
  (${__filename})`, () => {

  const Gate = require("../../lib/Gate");

  it("Sets gate id", () => {
    const gate = new Gate("test_id");
    assert.equal(gate.id, "test_id");
  });

  it("Gate accepts only string as id", () => {

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
    ].forEach((invalid_id)=>{
      assert.throws(()=>{ const gate = new Gate(invalid_id); },  Error);
    });

  });

  it("Sets gateway options", () => {
    const gate = new Gate("test_id", { option_1: 111, option_2: "abc" });
    assert.deepEqual(gate.options,   { option_1: 111, option_2: "abc" });
  });

  it("Creates gates map", () => {
    const gate = new Gate("test_id");
    assert.ok(gate.gates instanceof Map);
  });

  it("Gates map is empty initially", () => {
    const gate = new Gate("test_id");
    assert.equal(gate.gates.size, 0);
  });

  it("Sets callbacks map", () => {
    const gate = new Gate("test_id");
    assert.ok(gate.callbacks instanceof Map);
  });

});