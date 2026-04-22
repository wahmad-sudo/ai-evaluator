"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("responses")
      .select("*");

    setData(data || []);
  }

  const byOrg = {};

  data.forEach(r => {
    const key = r.organization_name || "Unknown";
    if (!byOrg[key]) byOrg[key] = [];
    byOrg[key].push(r);
  });

  return (
    <div style={{padding:40}}>
      <h1>Dashboard</h1>

      {Object.keys(byOrg).map(org => {
        const arr = byOrg[org];
        const avg =
          arr.reduce((a,b)=>a+(b.score||0),0)/arr.length;

        return (
          <div key={org}>
            <h3>{org}</h3>
            <p>Evaluations: {arr.length}</p>
            <p>Avg Score: {avg.toFixed(2)}</p>
          </div>
        );
      })}
    </div>
  );
}
