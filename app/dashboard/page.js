"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const run_id = "f4790bd3-210e-4657-847d-cf4e619b1d98";
  const [data, setData] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  async function load(){
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("run_id", run_id);

    setData(data || []);
  }

  const total = data.length;
  const avg =
    data.length > 0
      ? (data.reduce((a,b)=>a+(b.score||0),0)/data.length).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Average</p>
          <h2 className="text-2xl font-bold">{avg}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Runs</p>
          <h2 className="text-2xl font-bold">1</h2>
        </div>

      </div>

    </div>
  );
}
